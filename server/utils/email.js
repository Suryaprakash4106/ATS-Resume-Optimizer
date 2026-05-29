const nodemailer = require('nodemailer');

// Create transporter with error handling
let transporter = null;
let emailEnabled = false;

// Only initialize transporter if credentials exist
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout to prevent hanging
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
    
    // Don't verify on startup - it causes issues
    emailEnabled = true;
    console.log('✅ Email service configured');
  } catch (error) {
    console.log('⚠️ Email service setup failed:', error.message);
  }
} else {
  console.log('⚠️ Email credentials missing, using console OTP only');
}

const sendOTPEmail = async (to, otp) => {
  // Always log OTP to console first (for testing)
  console.log('\n=================================');
  console.log(`📧 TO: ${to}`);
  console.log(`🔐 OTP CODE: ${otp}`);
  console.log(`⏰ Valid for: 10 minutes`);
  console.log('=================================\n');
  
  // Try to send real email only if configured
  if (transporter && emailEnabled) {
    try {
      const mailOptions = {
        from: `"ATS Resume Optimizer" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Verify Your Email - ATS Resume Optimizer',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px;">
            <div style="background: white; padding: 30px; border-radius: 15px;">
              <h1 style="color: #667eea; text-align: center;">🎯 ATS Resume Optimizer</h1>
              <h2 style="color: #333; text-align: center;">Email Verification</h2>
              <p style="color: #666; font-size: 16px; text-align: center;">Your verification code is:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 15px 30px; border-radius: 10px; color: #667eea;">${otp}</span>
              </div>
              <p style="color: #999; font-size: 14px; text-align: center;">This code expires in 10 minutes.</p>
            </div>
          </div>
        `,
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}`);
    } catch (error) {
      console.log(`⚠️ Email send failed (using console OTP):`, error.message);
    }
  }
  
  return true;
};

module.exports = { sendOTPEmail };