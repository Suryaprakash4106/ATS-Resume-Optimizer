const axios = require('axios');

const sendOTPEmail = async (to, otp) => {
  console.log('\n=== OTP EMAIL DETAILS ===');
  console.log('TO: ' + to);
  console.log('OTP: ' + otp);
  console.log('Service: Brevo REST API');
  console.log('Valid for: 10 minutes\n');

  if (!to || !otp) {
    console.error('ERROR: Missing email or OTP');
    return false;
  }

  if (!process.env.BREVO_API_KEY) {
    console.error('ERROR: BREVO_API_KEY not set');
    return false;
  }

  if (!process.env.BREVO_FROM_EMAIL) {
    console.error('ERROR: BREVO_FROM_EMAIL not set');
    return false;
  }

  try {
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
        subject: 'Verify Your Email - ATS Resume Optimizer',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">ATS Resume Optimizer</h1>
            </div>
            <div style="background: white; padding: 40px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; text-align: center;">Email Verification</h2>
              <p style="color: #666; text-align: center; font-size: 16px;">Your OTP code:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: #667eea; padding: 20px; border-radius: 8px; display: inline-block;">
                  <span style="font-size: 40px; font-weight: bold; color: white; letter-spacing: 6px;">${otp}</span>
                </div>
              </div>
              <p style="color: #999; text-align: center; font-size: 14px;">This code is valid for 10 minutes</p>
              <p style="color: #666; text-align: center; font-size: 13px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        `
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

    console.log('SUCCESS: Email sent!');
    console.log('Message ID: ' + response.data.messageId);
    console.log('To: ' + to + '\n');
    return true;

  } catch (error) {
    console.error('\nERROR: Brevo API failed');
    
    if (error.response) {
      console.error('Status: ' + error.response.status);
      console.error('Details: ' + JSON.stringify(error.response.data));

      if (error.response.status === 401) {
        console.error('Issue: Invalid API Key');
      } else if (error.response.status === 400) {
        console.error('Issue: Bad Request - Check FROM email is verified');
      } else if (error.response.status === 429) {
        console.error('Issue: Rate Limited');
      }
    } else {
      console.error('Error: ' + error.message);
    }
    
    return false;
  }
};

module.exports = { sendOTPEmail };