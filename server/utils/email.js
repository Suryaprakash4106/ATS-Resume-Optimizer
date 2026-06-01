const axios = require('axios');

const sendOTPEmail = async (to, otp) => {
  console.log('\n╔════════════════════════════════╗');
  console.log('║     OTP EMAIL DETAILS           ║');
  console.log('╠════════════════════════════════╣');
  console.log(`║ TO: ${to.padEnd(27)}║`);
  console.log(`║ OTP: ${otp.padEnd(25)}║`);
  console.log('║ Service: Brevo REST API        ║');
  console.log('║ Valid for: 10 minutes          ║');
  console.log('╚════════════════════════════════╝\n');

  // Validate inputs
  if (!to || !otp) {
    console.error('❌ Missing email or OTP');
    return false;
  }

  // Check environment variables
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY not found in environment variables');
    console.error('   Make sure it\'s set in your .env file');
    return false;
  }

  if (!process.env.BREVO_FROM_EMAIL) {
    console.error('❌ BREVO_FROM_EMAIL not found in environment variables');
    return false;
  }

  try {
    // Brevo REST API v3 endpoint for sending transactional emails
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'ATS Resume Optimizer',
          email: process.env.BREVO_FROM_EMAIL
        },
        to: [
          {
            email: to,
            name: 'User'
          }
        ],
        subject: '🔐 Verify Your Email - ATS Resume Optimizer',
        htmlContent: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎯 ATS Resume Optimizer</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Email Verification Required</p>
              </div>

              <!-- Body -->
              <div style="padding: 40px 20px;">
                <h2 style="color: #333; text-align: center; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email</h2>
                <p style="color: #666; font-size: 16px; text-align: center; margin: 0 0 30px 0; line-height: 1.6;">
                  Thank you for signing up! Please use the one-time password below to verify your email address.
                </p>

                <!-- OTP Box -->
                <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                  <p style="color: rgba(255,255,255,0.8); margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your OTP Code</p>
                  <div style="font-size: 48px; font-weight: 700; letter-spacing: 8px; color: white; font-family: 'Courier New', monospace; margin: 0; word-break: break-all;">
                    ${otp}
                  </div>
                </div>

                <!-- Timer Info -->
                <p style="color: #999; font-size: 14px; text-align: center; margin: 20px 0; font-weight: 600;">
                  ⏰ This code expires in <span style="color: #667eea;">10 minutes</span>
                </p>

                <!-- Divider -->
                <hr style="border: none; border-top: 2px solid #eee; margin: 30px 0;">

                <!-- Security Info -->
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <p style="color: #333; font-size: 14px; margin: 0; font-weight: 600;">🔒 Security Notice</p>
                  <p style="color: #666; font-size: 13px; margin: 8px 0 0 0; line-height: 1.5;">
                    Never share this code with anyone. We will never ask for it. If you didn't request this code, please ignore this email.
                  </p>
                </div>

                <!-- FAQ -->
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #333; font-size: 14px; margin: 0; font-weight: 600;">❓ Didn't request this?</p>
                  <p style="color: #666; font-size: 13px; margin: 8px 0 0 0; line-height: 1.5;">
                    Your account won't be created unless you complete the verification. If this wasn't you, you can safely ignore this email.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0 0 8px 0;">
                  ATS Resume Optimizer - Get Your Resume Past The ATS Bots
                </p>
                <p style="color: #bbb; font-size: 11px; margin: 0;">
                  © ${new Date().getFullYear()} All Rights Reserved | Powered by Brevo
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        // Optional: Track opens and clicks
        trackOpens: true,
        trackClicks: true
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log(`✅ Email sent successfully!`);
    console.log(`   Message ID: ${response.data.messageId}`);
    console.log(`   To: ${to}`);
    console.log(`   Status: Sent to Brevo\n`);
    
    return true;

  } catch (error) {
    console.error('\n❌ BREVO API ERROR');
    console.error('═══════════════════════════════════════════════');
    
    if (error.response) {
      console.error(`Status Code: ${error.response.status}`);
      console.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);

      // Helpful error messages
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        console.error('\n⚠️  ISSUE: Invalid API Key');
        console.error('   → Check BREVO_API_KEY in your .env file');
        console.error('   → Make sure it starts with "xkeysib-"');
        console.error('   → Verify the key is Active in Brevo dashboard');
      } else if (status === 400) {
        console.error('\n⚠️  ISSUE: Bad Request');
        console.error('   → Check if FROM email is verified in Brevo');
        console.error('   → Check if email format is valid');
        console.error('   → Make sure BREVO_FROM_EMAIL matches your account');
      } else if (status === 429) {
        console.error('\n⚠️  ISSUE: Rate Limited');
        console.error('   → Too many emails sent too quickly');
        console.error('   → Wait a moment and try again');
      } else if (status === 403) {
        console.error('\n⚠️  ISSUE: Forbidden');
        console.error('   → Check if your account has email sending enabled');
        console.error('   → Verify Brevo account is active');
      }
    } else if (error.request) {
      console.error('No response from Brevo server');
      console.error('→ Check your internet connection');
      console.error('→ Check if api.brevo.com is accessible');
    } else {
      console.error('Request setup error:', error.message);
    }
    
    console.error('═══════════════════════════════════════════════\n');
    return false;
  }
};

module.exports = { sendOTPEmail };