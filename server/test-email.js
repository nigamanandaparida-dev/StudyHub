import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import qrcode from 'qrcode-terminal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server root
dotenv.config({ path: path.join(__dirname, '.env') });

const testEmail = async () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  let transporter;
  let fromEmail;

  if (user && pass) {
    console.log(`\n📧 Real Mode: Using ${user}...`);
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    fromEmail = `"StudyHub Test" <${user}>`;
  } else {
    console.log('\n⚠️ Fallback Mode: Using Ethereal Email (No credentials found in .env)');
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
    to: user || 'test@example.com',
    subject: 'StudyHub Email Test Success! ✅',
    text: 'Your email configuration for StudyHub is working!',
    html: '<h1 style="color: #10b981;">StudyHub Test Success! ✅</h1><p>Your email system is ready.</p>',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ SUCCESS: Test email processed!');
    if (!user) {
      const url = nodemailer.getTestMessageUrl(info);
      console.log('\n📱 [SCAN TO VIEW TEST EMAIL ON YOUR PHONE]');
      qrcode.generate(url, { small: true });
      console.log('🔗 OR CLICK HERE:', url);
    } else {
      console.log('Please check your Gmail inbox.\n');
    }
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
  }
};

testEmail();
