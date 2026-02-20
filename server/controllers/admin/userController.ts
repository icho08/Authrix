import { Request, Response } from 'express';
import prisma from '../../config/prisma.js';
import { logger } from '../../config/logger.js';
import { sendEmail } from '../../utils/emailService.js';
import bcrypt from 'bcryptjs';

// Extend Request type to include user and application from middleware
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    applicationId?: string;
  };
  application?: {
    id: string;
    name: string;
  };
}

export const sendCustomEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { appId, userId, subject, body } = req.body;
    const adminUser = req.user;

    if (!adminUser) return res.status(401).json({ error: "Unauthorized" });
    if (!appId || !userId || !subject || !body) {
      return res.status(400).json({ error: "appId, userId, subject, and body are required" });
    }

    // Verify app ownership
    const app = await prisma.application.findFirst({
      where: { id: appId, userId: adminUser.userId }
    });

    if (!app) return res.status(404).json({ error: "Application not found" });

    // Find the recipient user
    const targetUser = await prisma.user.findFirst({
      where: { id: userId, applicationId: appId }
    });

    if (!targetUser) return res.status(404).json({ error: "User not found" });

    await sendEmail({
      to: targetUser.email,
      from: `"${app.name}" <${process.env.SMTP_USERNAME}>`,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1f2937;">${subject}</h2>
          <div style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">
            ${body}
          </div>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 12px;">
            Sent via <strong>${app.name}</strong>
          </p>
        </div>
      `
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error: any) {
    logger.error(`Error sending custom email: ${error.message}`);
    res.status(500).json({ error: "Failed to send email" });
  }
};

export const resetUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { appId, userId, newPassword } = req.body;
    const adminUser = req.user;

    if (!adminUser) return res.status(401).json({ error: "Unauthorized" });
    if (!appId || !userId || !newPassword) {
      return res.status(400).json({ error: "appId, userId, and newPassword are required" });
    }

    // Verify app ownership
    const app = await prisma.application.findFirst({
      where: { id: appId, userId: adminUser.userId }
    });

    if (!app) return res.status(404).json({ error: "Application not found" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUser = await prisma.user.updateMany({
      where: { id: userId, applicationId: appId },
      data: { password: hashedPassword }
    });

    if (updatedUser.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Terminate all sessions for this user for security
    await prisma.session.deleteMany({
      where: { userId }
    });

    res.status(200).json({ message: "Password reset successfully and sessions cleared" });
  } catch (error: any) {
    logger.error(`Error resetting user password: ${error.message}`);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

export const toggleUserVerification = async (req: AuthRequest, res: Response) => {
  try {
    const { appId, userId, isVerified } = req.body;
    const adminUser = req.user;

    if (!adminUser) return res.status(401).json({ error: "Unauthorized" });
    if (!appId || !userId || isVerified === undefined) {
      return res.status(400).json({ error: "appId, userId, and isVerified are required" });
    }

    // Verify app ownership
    const app = await prisma.application.findFirst({
      where: { id: appId, userId: adminUser.userId }
    });

    if (!app) return res.status(404).json({ error: "Application not found" });

    // Update user verification status
    const updatedUser = await prisma.user.updateMany({
      where: { id: userId, applicationId: appId },
      data: { isVerified }
    });

    if (updatedUser.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: `User verification status updated to ${isVerified}` });
  } catch (error: any) {
    logger.error(`Error toggling user verification: ${error.message}`);
    res.status(500).json({ error: "Failed to update verification status" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { appId, userId } = req.body;
    const adminUser = req.user;

    if (!adminUser) return res.status(401).json({ error: "Unauthorized" });
    if (!appId || !userId) {
      return res.status(400).json({ error: "appId and userId are required" });
    }

    // Verify app ownership
    const app = await prisma.application.findFirst({
      where: { id: appId, userId: adminUser.userId }
    });

    if (!app) return res.status(404).json({ error: "Application not found" });

    // Delete user
    await prisma.session.deleteMany({
      where: { userId }
    });

    const deletedUser = await prisma.user.deleteMany({
      where: { id: userId, applicationId: appId }
    });

    if (deletedUser.count === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User and sessions deleted successfully" });
  } catch (error: any) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const exportUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { appId } = req.body;
    const adminUser = req.user;

    if (!adminUser) return res.status(401).json({ error: "Unauthorized" });
    if (!appId) {
      return res.status(400).json({ error: "appId is required" });
    }

    // Verify app ownership and fetch users
    const app = await prisma.application.findFirst({
      where: { id: appId, userId: adminUser.userId },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    if (!app) return res.status(404).json({ error: "Application not found" });

    // Create CSV content
    const header = "ID,Username,Email,Verified,CreatedAt,UpdatedAt\n";
    const rows = app.users.map((u: any) => 
      `${u.id},${u.username || ''},${u.email},${u.isVerified},${u.createdAt.toISOString()},${u.updatedAt.toISOString()}`
    ).join("\n");

    const csvContent = header + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users_${app.name.replace(/\s+/g, '_')}.csv`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    logger.error(`Error exporting users: ${error.message}`);
    res.status(500).json({ error: "Failed to export users" });
  }
};
