import nodemailer from "nodemailer"; 
import 'dotenv/config'

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface LoginAlertOptions {
  to: string;
  deviceInfo: string;
  location?: string;
  timestamp: Date;
  ipAddress: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendEmail = async (options: EmailOptions) => {
  await transporter.sendMail(options);
}



export const sendLoginAlert = async (options: LoginAlertOptions) => {
  const html = `
    <h3>New Login Detected</h3>
    <p><strong>Device:</strong> ${options.deviceInfo}</p>
    <p><strong>IP:</strong> ${options.ipAddress}</p>
    <p><strong>Time:</strong> ${options.timestamp.toLocaleString()}</p>
    ${options.location ? `<p><strong>Location:</strong> ${options.location}</p>` : ''}
  `;
  
  await transporter.sendMail({
    to: options.to,
    subject: "New Login Alert",
    html
  });
};
export const sendVerificationEmail = async (email: string, token: string, appName: string, from: string) => {
  const baseUrl = process.env.CLIENT_URL || 'system error';
  const verifyUrl = `${baseUrl}/verify?token=${token}`;
  
  await transporter.sendMail({
    to: email,
    from,
    subject: `Verify your ${appName} account`,
    html: `
      <h3>Welcome to ${appName}!</h3>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyUrl}">Verify Account</a>
      <p>This link expires in 24 hours.</p>
    `
  });
};

export const SendWelcomeEmail = async (to: string) => {
  await transporter.sendMail({
    to,
    subject: "Welcome to our service",
    html: `
      <h3>Welcome to our service!</h3>
      <p>Thank you for using our service. We hope you find it useful.</p>
    `
  });
}

interface PasswordResetOptions {
  to : string , 
  token : string, 
  appName : string

}
export const SendPasswordResetEmail = async( options : PasswordResetOptions) => { 
  await transporter.sendMail({
    to: options.to,
    subject: `Reset your ${options.appName} password`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset your ${options.appName} password</h2>
        <p>You requested to reset your password. Use the code below to reset your password:</p>
        
        <div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0; color: #495057; font-family: monospace;">
            ${options.token}
          </h1>
        </div>
        
        <p><strong>This code expires in 15 minutes.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 14px;">
          This is an automated message from ${options.appName}. Please do not reply to this email.
        </p>
      </div>
    `
  });
}