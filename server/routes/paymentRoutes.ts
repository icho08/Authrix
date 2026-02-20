import express from 'express';
import { initiatePayment, verifyPayment } from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/jwtAuth.js';
import { verifyApiKey } from '../middleware/apiAuth.js';

const router = express.Router();

router.post('/initiate', verifyApiKey, authenticateUser, initiatePayment);
router.get('/verify', verifyPayment);

export default router;
