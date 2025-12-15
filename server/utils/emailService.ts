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
  const baseUrl = process.env.CLIENT_URL || 'system error';
  const resetUrl = `${baseUrl}/reset-password?token=${options.token}`;
  await transporter.sendMail({
    to: options.to,
    subject: `Reset your ${options.appName} password`,
    html: `
      <h3>Reset your ${options.appName} password</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 24 hours.</p>
    `
  });
}