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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Login Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
          <div style="width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Security Alert</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">New login detected on your account</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
              ⚠️ We detected a new login to your account. If this was you, no action is needed.
            </p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Login Details:</h3>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #6b7280; font-size: 14px;">Device:</span>
              <span style="color: #1f2937; font-size: 14px; font-weight: 500;">${options.deviceInfo}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #6b7280; font-size: 14px;">IP Address:</span>
              <span style="color: #1f2937; font-size: 14px; font-weight: 500;">${options.ipAddress}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #6b7280; font-size: 14px;">Time:</span>
              <span style="color: #1f2937; font-size: 14px; font-weight: 500;">${options.timestamp.toLocaleString()}</span>
            </div>
            
            ${options.location ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #6b7280; font-size: 14px;">Location:</span>
              <span style="color: #1f2937; font-size: 14px; font-weight: 500;">${options.location}</span>
            </div>
            ` : ''}
          </div>

          <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 12px 0; color: #991b1b; font-size: 14px; font-weight: 600;">Wasn't you?</p>
            <p style="margin: 0; color: #7f1d1d; font-size: 14px;">
              If you don't recognize this login, please secure your account immediately by changing your password.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            This is an automated security notification. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    to: options.to,
    subject: "🔒 New Login Alert - Security Notification",
    html
  });
};
export const sendVerificationEmail = async (email: string, token: string, appName: string, from: string) => {
  const baseUrl = process.env.CLIENT_URL || 'system error';
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px 24px; text-align: center;">
          <div style="width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to ${appName}!</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Please verify your email address to get started</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Almost there!</h2>
            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.5;">
              We just need to verify your email address to complete your account setup and ensure the security of your account.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); transition: all 0.2s;">
              ✅ Verify Email Address
            </a>
          </div>

          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">Can't click the button?</p>
            <p style="margin: 0; color: #075985; font-size: 14px;">
              Copy and paste this link into your browser: <br>
              <span style="word-break: break-all; font-family: monospace; background-color: #e0f2fe; padding: 4px 8px; border-radius: 4px;">${verifyUrl}</span>
            </p>
          </div>

          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⏰ <strong>Important:</strong> This verification link expires in 24 hours for security reasons.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
            This email was sent to ${email}
          </p>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            If you didn't create an account with ${appName}, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    to: email,
    from,
    subject: `🎉 Welcome to ${appName} - Please verify your email`,
    html
  });
};

export const SendWelcomeEmail = async (to: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
          <div style="width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome Aboard! 🎉</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Thank you for joining our community</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">You're all set!</h2>
            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.5;">
              We're excited to have you on board. Our service is designed to make your experience smooth and enjoyable.
            </p>
          </div>

          <!-- Features -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">What's next?</h3>
            
            <div style="margin-bottom: 12px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="color: #10b981; margin-right: 8px;">✅</span>
                <span style="color: #374151; font-size: 14px;">Explore all the features available to you</span>
              </div>
            </div>
            
            <div style="margin-bottom: 12px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="color: #10b981; margin-right: 8px;">✅</span>
                <span style="color: #374151; font-size: 14px;">Set up your profile and preferences</span>
              </div>
            </div>
            
            <div>
              <div style="display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 8px;">✅</span>
                <span style="color: #374151; font-size: 14px;">Connect with our community and support</span>
              </div>
            </div>
          </div>

          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px;">
            <p style="margin: 0; color: #075985; font-size: 14px;">
              💡 <strong>Need help?</strong> Our support team is here to assist you every step of the way. Don't hesitate to reach out!
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            Thank you for choosing our service. We're here to help you succeed!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    to,
    subject: "🎉 Welcome! You're all set to get started",
    html
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