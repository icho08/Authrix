import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { ValidationError } from '../utils/errors.js';

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || ''; // UAT Secret Key
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_URL = process.env.ESEWA_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_VERIFICATION_URL = process.env.ESEWA_VERIFICATION_URL || 'https://rc.esewa.com.np/api/epay/transaction/status/';

const SUCCESS_URL = `${process.env.CLIENT_URL}/payment-success`;
const FAILURE_URL = `${process.env.CLIENT_URL}/payment-failure`;

export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, planName } = req.body;
    const user = (req as any).user;

    if (!amount || !planName) {
      throw new ValidationError("Amount and planName are required");
    }

    const transactionUuid = `${Date.now()}-${user.userId.slice(-5)}`;
    
    // Ensure amount is a string and formatted correctly (eSewa is picky about decimals)
    // If it's something like 400.0, we want to make sure it matches what we send in the form
    const formattedAmount = String(amount);

    // Create a pending transaction record
    await prisma.transaction.create({
      data: {
        amount: parseFloat(formattedAmount),
        transactionUuid,
        productCode: ESEWA_PRODUCT_CODE,
        userId: user.userId,
        status: 'PENDING',
        applicationId: planName // Stored for plan upgrade on callback
      }
    });

    // Signature generation logic for eSewa V2
    // order matters: total_amount,transaction_uuid,product_code
    const signatureString = `total_amount=${formattedAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
    
    const signature = crypto
      .createHmac('sha256', ESEWA_SECRET_KEY)
      .update(signatureString)
      .digest('base64');

    logger.debug('eSewa Payment Initiation', { 
      transactionUuid, 
      formattedAmount, 
      productCode: ESEWA_PRODUCT_CODE,
      signatureString 
    });

    res.status(200).json({
      url: ESEWA_URL,
      formData: {
        amount: formattedAmount,
        tax_amount: "0",
        total_amount: formattedAmount,
        transaction_uuid: transactionUuid,
        product_code: ESEWA_PRODUCT_CODE,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: SUCCESS_URL,
        failure_url: FAILURE_URL,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.query; // eSewa returns parameters in a single 'data' query param as base64 string

    if (!data || typeof data !== 'string') {
      return res.status(400).json({ error: "Missing response data" });
    }

    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    const { transaction_code, status, total_amount, transaction_uuid, product_code, signature } = decodedData;

    // 1. Verify signature from response to ensure integrity
    const signedFieldNames = decodedData.signed_field_names;
    const fields = signedFieldNames.split(',');
    const signatureString = fields.map((field: string) => `${field}=${decodedData[field]}`).join(',');
    
    const expectedSignature = crypto
      .createHmac('sha256', ESEWA_SECRET_KEY)
      .update(signatureString)
      .digest('base64');

    if (signature !== expectedSignature) {
      logger.error('Invalid signature in eSewa verification', { transaction_uuid, expectedSignature, receivedSignature: signature });
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 2. Server-to-Server Verification (Recommended by eSewa)
    try {
      const verificationResponse = await axios.get(ESEWA_VERIFICATION_URL, {
        params: {
          product_code: product_code,
          total_amount: total_amount,
          transaction_uuid: transaction_uuid
        }
      });

      if (verificationResponse.data.status !== 'COMPLETE') {
        logger.error('eSewa transaction verification failed or incomplete', { 
          transaction_uuid, 
          status: verificationResponse.data.status 
        });
        
        await prisma.transaction.update({
          where: { transactionUuid: transaction_uuid },
          data: { status: verificationResponse.data.status || 'FAILED' }
        });
        
        return res.redirect(FAILURE_URL);
      }
    } catch (apiError: any) {
      logger.error('Error calling eSewa verification API', { 
        transaction_uuid, 
        error: apiError.message,
        response: apiError.response?.data
      });
      // We might want to allow it if status is COMPLETE and signature is valid, 
      // but strict verification is safer.
      return res.status(500).json({ error: "Failed to verify transaction with eSewa" });
    }

    if (status === 'COMPLETE') {
      const transaction = await prisma.transaction.findUnique({ where: { transactionUuid: transaction_uuid } });
      if (!transaction) throw new Error("Transaction not found");

      const planName = transaction.applicationId?.toUpperCase() as any; 

      await prisma.$transaction([
        prisma.transaction.update({
          where: { transactionUuid: transaction_uuid },
          data: {
            status: 'COMPLETE',
            transactionCode: transaction_code
          }
        }),
        prisma.user.update({
             where: { id: transaction.userId },
             data: {
                 plan: planName || 'FREE'
             }
        })
      ]);
      return res.redirect(`${SUCCESS_URL}?transaction_uuid=${transaction_uuid}`);
    } else {
        await prisma.transaction.update({
            where: { transactionUuid: transaction_uuid },
            data: { status: 'FAILED' }
        });
        return res.redirect(FAILURE_URL);
    }
  } catch (error) {
    next(error);
  }
};
