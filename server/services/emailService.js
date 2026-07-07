import nodemailer from 'nodemailer';

const getTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

export async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || 'GOL LOW Solar Support <Hr@gollowsolarenergy.com>';

  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text,
      });
      console.log(`[Email Service] Sent email to ${to}: "${subject}"`);
    } catch (error) {
      console.error('[Email Service] Error sending email:', error);
    }
  } else {
    console.log(`
=========================================
[DEV EMAIL FALLBACK - SMTP NOT CONFIGURED]
From: ${from}
To: ${to}
Subject: ${subject}
Text: ${text || 'HTML Content'}
HTML:
${html}
=========================================
`);
  }
}

// 1. Inquiry Receipt Email
export async function sendInquiryReceipt({ email, name, detailSummary }) {
  const subject = 'GOL LOW Solar - Inquiry Proposal Request Received';
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #061B2D; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px;">
      <h2 style="color: #f9b233; font-family: 'Sora', sans-serif;">Marhaban, ${name}!</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        We have received your energy audit proposal request. Our engineering team is currently running a preliminary drone survey of your roof loading capabilities and utility connections.
      </p>
      <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
        <span style="color: #f9b233; font-size: 11px; font-weight: bold; text-transform: uppercase;">Inquiry Details:</span>
        <p style="color: #ffffff; font-size: 13px; margin: 5px 0 0 0;">${detailSummary}</p>
      </div>
      <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
        A solar systems engineer will get in touch with you within 1 business day with the preliminary blueprint.
      </p>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
      <span style="font-size: 11px; color: #64748b;">GOL LOW Solar Energy Systems Rental • Al Muraqqabat, Port Saeed, Dubai, United Arab Emirates</span>
    </div>
  `;
  await sendEmail({ to: email, subject, html, text: `Proposal Request Received. Sizing: ${detailSummary}` });
}

// 2. Booking Receipt Email
export async function sendBookingReceipt({ email, name, date, time }) {
  const subject = 'GOL LOW Solar - Free Consultation Booking Confirmed';
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #061B2D; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px;">
      <h2 style="color: #4CAF50; font-family: 'Sora', sans-serif;">Booking Confirmed!</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Marhaban, ${name}. Your energy consultation meeting with our engineers has been successfully scheduled.
      </p>
      <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
        <span style="color: #4CAF50; font-size: 11px; font-weight: bold; text-transform: uppercase;">Appointment:</span>
        <p style="color: #ffffff; font-size: 14px; font-weight: bold; margin: 5px 0 0 0;">${date} at ${time}</p>
      </div>
      <p style="color: #cbd5e1; font-size: 13px;">
        An engineer will contact you at your preferred time to verify rooftop measurements and utility load details.
      </p>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
      <span style="font-size: 11px; color: #64748b;">GOL LOW Solar Energy Systems Rental • Dubai, UAE</span>
    </div>
  `;
  await sendEmail({ to: email, subject, html, text: `Booking confirmed for ${date} at ${time}` });
}

// 3. Admin Notification
export async function sendAdminNotification({ type, dataSummary }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'Hr@gollowsolarenergy.com';
  const subject = `[GOL LOW ALERT] New ${type} Registered`;
  const html = `
    <div style="font-family: 'Inter', sans-serif; color: #334155; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
      <h3 style="color: #0f172a; margin-top: 0;">New ${type} Submission</h3>
      <p style="font-size: 13px; color: #475569;">
        A new ${type.toLowerCase()} record was added to the database. Please review details in the admin panel.
      </p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 12px;">
        ${dataSummary}
      </div>
      <p style="font-size: 12px; margin-top: 20px;">
        <a href="http://localhost:5174/admin" style="background-color: #061b2d; color: #ffffff; padding: 8px 15px; text-decoration: none; border-radius: 4px;">Open Admin Dashboard</a>
      </p>
    </div>
  `;
  await sendEmail({ to: adminEmail, subject, html, text: `New ${type} received: ${dataSummary}` });
}

// 4. Newsletter Welcome Email
export async function sendNewsletterWelcome({ email }) {
  const subject = 'Welcome to Solar Insights by GOL LOW';
  const html = `
    <div style="font-family: 'Inter', sans-serif; background-color: #061B2D; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px;">
      <h2 style="color: #f9b233; font-family: 'Sora', sans-serif;">Welcome to Solar Insights!</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Thank you for subscribing. You are now joined with hundreds of UAE facilities, engineers, and property developers receiving monthly guides on utility bill offsets, net metering tips, and solar design audits.
      </p>
      <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
        Look out for our upcoming newsletter detailing DEWA Shams updates and solar container battery sizing!
      </p>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
      <p style="font-size: 10px; color: #64748b;">
        If you wish to unsubscribe, you can manage settings in your account or contact support.
      </p>
    </div>
  `;
  await sendEmail({ to: email, subject, html, text: 'Welcome to Solar Insights newsletter subscription!' });
}
