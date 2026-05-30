const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (to, otp) => {
  // Always log OTP to console first (fallback)
  console.log('\n=================================');
  console.log(`📧 TO: ${to}`);
  console.log(`🔐 OTP CODE: ${otp}`);
  console.log(`⏰ Valid for: 10 minutes`);
  console.log('=================================\n');
  
  // Try to send real email via Resend
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
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
            <hr style="border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; text-align: center;">ATS Resume Optimizer - Get your resume past the ATS bots!</p>
          </div>
        </div>
      `,
    });
    
    if (error) {
      console.error('❌ Resend error:', error);
      console.log('⚠️ Using console OTP as fallback');
      return false;
    }
    
    console.log(`✅ Email sent via Resend! ID: ${data?.id}`);
    return true;
    
  } catch (error) {
    console.error('❌ Resend failed:', error.message);
    console.log('⚠️ Using console OTP as fallback');
    return false;
  }
};

module.exports = { sendOTPEmail };