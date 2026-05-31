const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (to, otp) => {
  try {
    // Log OTP to console for debugging
    console.log('\n╔════════════════════════════════╗');
    console.log('║     OTP EMAIL DETAILS           ║');
    console.log('╠════════════════════════════════╣');
    console.log(`║ TO: ${to.padEnd(27)}║`);
    console.log(`║ OTP: ${otp.padEnd(25)}║`);
    console.log('║ Service: Resend (Production)   ║');
    console.log('║ Valid for: 10 minutes          ║');
    console.log('╚════════════════════════════════╝\n');

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'noreply@resend.dev',
      to: [to],
      subject: '🔐 Verify Your Email - ATS Resume Optimizer',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 20px 20px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 ATS Resume Optimizer</h1>
          </div>
          
          <div style="background: white; padding: 40px 20px; border-radius: 0 0 20px 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-top: 0;">Email Verification</h2>
            
            <p style="color: #666; font-size: 16px; text-align: center; margin: 20px 0;">
              Your OTP (One-Time Password) for registration:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; display: inline-block;">
                <span style="font-size: 48px; font-weight: bold; letter-spacing: 8px; color: white;">${otp}</span>
              </div>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin: 20px 0;">
              ⏰ This code is valid for <strong>10 minutes</strong>
            </p>
            
            <hr style="border: none; border-top: 2px solid #eee; margin: 30px 0;">
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #666; font-size: 14px; margin: 5px 0;">
                <strong>❓ Didn't request this code?</strong><br>
                Please ignore this email. Your account won't be created unless you verify it.
              </p>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
              ATS Resume Optimizer - Get your resume past the ATS bots!<br>
              © ${new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend API Error:');
      console.error(`   ${error.message}`);
      return false;
    }

    console.log(`✅ Email sent successfully via Resend!`);
    console.log(`   Email ID: ${data.id}`);
    console.log(`   To: ${to}\n`);
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Check: RESEND_API_KEY in .env is correct\n`);
    return false;
  }
};

module.exports = { sendOTPEmail };