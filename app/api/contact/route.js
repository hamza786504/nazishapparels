import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const CONTACT_TO = process.env.CONTACT_TO || 'hamzakhaliddev@gmail.com';
const CONTACT_FROM = process.env.CONTACT_FROM || CONTACT_TO;

const REQUIRED_FIELDS = ['name', 'email', 'subject', 'message'];

function buildHtmlTable(fields) {
  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;white-space:nowrap;">${key}</td><td style="padding:10px 14px;border:1px solid #ddd;white-space:pre-wrap;">${value}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="font-family:Arial,Helvetica,sans-serif;color:#222;margin:0;padding:24px;background:#fafafa;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:6px;overflow:hidden;border:1px solid #e5e5e5;">
      <div style="background:#1a1a1a;color:#fff;padding:18px 24px;font-size:18px;font-weight:bold;">
        New Contact Inquiry &mdash; NazishApparels
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
      </table>
      <div style="padding:14px 24px;color:#888;font-size:12px;">
        Sent from the contact form on nazishapparels.com
      </div>
    </div>
  </body>
</html>`;
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }

    for (const field of REQUIRED_FIELDS) {
      if (!body || typeof body[field] !== 'string' || !body[field].trim()) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}.` },
          { status: 400 }
        );
      }
    }

    const fields = {
      'Full Name': body.name.trim(),
      'Email Address': body.email.trim(),
      'Inquiry Type': body.subject.trim(),
      'Inquiry': body.message.trim(),
    };

    const html = buildHtmlTable(fields);
    const text = Object.entries(fields)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error(
        'SMTP not configured: set SMTP_HOST, SMTP_USER and SMTP_PASS in .env.local to enable email sending.'
      );
      return NextResponse.json(
        {
          success: false,
          error:
            'Email delivery is not configured. The website owner needs to set up SMTP credentials.',
        },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465 ? true : false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: body.email.trim(),
      subject: `Contact Inquiry: ${fields['Inquiry Type']} — ${fields['Full Name']}`,
      text,
      html,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      { success: false, error: 'There was a problem sending your message. Please try again.' },
      { status: 500 }
    );
  }
}