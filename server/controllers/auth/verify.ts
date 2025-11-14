import prisma from "../../config/prisma";
import { Request , Response } from "express";
export const verifyEmail =   async (req : Request, res  : Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send(`
      <html><body>
        <h2>Invalid verification link</h2>
        <p>The verification link is invalid or missing.</p>
      </body></html>
    `);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).send(`
        <html><body>
          <h2>Verification Failed</h2>
          <p>Invalid or expired verification token.</p>
        </body></html>
      `);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpiry: null
      }
    });

    res.send(`
      <html><body>
        <h2>Email Verified Successfully!</h2>
        <p>Your account has been verified. You can now log in.</p>
      </body></html>
    `);
  } catch (error) {
    res.status(500).send(`
      <html><body>
        <h2>Verification Error</h2>
        <p>An error occurred during verification. Please try again.</p>
      </body></html>
    `);
  }
}
