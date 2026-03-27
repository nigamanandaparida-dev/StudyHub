import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import qrcode from 'qrcode-terminal';

dotenv.config();

// Utility to check if email is configured
const isEmailConfigured = () => process.env.EMAIL_USER && process.env.EMAIL_PASS;

export const sendOTP = async (email, otp) => {
  let transporter;
  let fromEmail;

  if (isEmailConfigured()) {
    // REAL GMAIL MODE
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    fromEmail = `"StudyHub Verification" <${process.env.EMAIL_USER}>`;
  } else {
    // FALLBACK: ETHEREAL EMAIL (For testing without credentials)
    console.log('⚠️ Warning: Email credentials missing. Using Ethereal Email fallback...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    fromEmail = `"StudyHub Test" <${testAccount.user}>`;
  }

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'Verification Code: ' + otp + ' - StudyHub',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 20px auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #10b981; margin: 0; font-size: 28px;">StudyHub</h1>
        </div>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hello,</p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Thank you for joining StudyHub! To complete your registration, please enter the following code:</p>
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 25px;">This code will expire in 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">&copy; 2026 StudyHub Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP Generated for:', email);
    
    let previewUrl = null;
    if (!isEmailConfigured()) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n📱 [SCAN TO VIEW OTP ON YOUR PHONE]');
      qrcode.generate(previewUrl, { small: true });
      console.log('🔗 OR CLICK HERE:', previewUrl);
    } else {
      console.log('✅ Real email sent via Gmail');
    }
    return { success: true, previewUrl };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw new Error('Failed to send verification email: ' + error.message);
  }
};
