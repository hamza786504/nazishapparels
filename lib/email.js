import nodemailer from 'nodemailer';

const STORE_NAME = 'NazishApparels';

// Best-effort email sending. Returns { sent: boolean, error: string | null }.
// Never throws so a mail failure can never break an order or registration.
export async function sendEmail({ to, subject, html, text, replyTo }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error(
      'SMTP not configured: set SMTP_HOST, SMTP_USER and SMTP_PASS in .env.local to enable email sending.'
    );
    return { sent: false, error: 'SMTP not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465 ? true : false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM || smtpUser,
      to,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
    });

    return { sent: true, error: null };
  } catch (error) {
    console.error('Email send error:', error);
    return { sent: false, error: error.message };
  }
}

// Shared email shell matching the store's look.
function wrapEmail(title, bodyHtml) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="font-family:Arial,Helvetica,sans-serif;color:#222;margin:0;padding:24px;background:#fafafa;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:6px;overflow:hidden;border:1px solid #e5e5e5;">
      <div style="background:#1a1a1a;color:#fff;padding:18px 24px;font-size:18px;font-weight:bold;">
        ${title} &mdash; ${STORE_NAME}
      </div>
      <div style="padding:24px;">
        ${bodyHtml}
      </div>
      <div style="padding:14px 24px;color:#888;font-size:12px;border-top:1px solid #eee;">
        Sent by ${STORE_NAME} &middot; nazishapparels.com
      </div>
    </div>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Welcome / registration email ──────────────────────────────────────────────
export function buildWelcomeEmail({ firstName, email }) {
  const name = escapeHtml(firstName || 'there');
  const html = wrapEmail(
    'Welcome to Your Account',
    `
    <h2 style="margin:0 0 12px;font-size:20px;">Welcome, ${name}!</h2>
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      Your ${STORE_NAME} account has been created successfully. You can now track your
      orders, manage your saved addresses and enjoy a faster checkout.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr>
        <td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;white-space:nowrap;">Account Email</td>
        <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(email)}</td>
      </tr>
    </table>
    `
  );
  const text = `Welcome, ${firstName || 'there'}!\n\nYour ${STORE_NAME} account has been created successfully. You can now track your orders, manage your saved addresses and enjoy a faster checkout.\n\nAccount Email: ${email}`;
  return { html, text };
}

// ── Order confirmation email ──────────────────────────────────────────────────
export function buildOrderEmail({ order }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const rows = items
    .map((item) => {
      const colorPart = item.color && item.color !== 'Default' ? ` / ${item.color}` : '';
      return `<tr>
        <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(item.title)}</td>
        <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(item.size || '—')}${escapeHtml(colorPart)}</td>
        <td style="padding:10px 14px;border:1px solid #ddd;text-align:center;">${Number(item.quantity) || 1}</td>
        <td style="padding:10px 14px;border:1px solid #ddd;text-align:right;">Rs. ${Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
      </tr>`;
    })
    .join('');

  const html = wrapEmail(
    'Order Confirmation',
    `
    <h2 style="margin:0 0 12px;font-size:20px;">Thank you for your order!</h2>
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;">
      We've received your order <strong>${escapeHtml(order.orderId)}</strong>. Our concierge
      team will contact you shortly to confirm your delivery details.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
      <tr>
        <td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;white-space:nowrap;">Order ID</td>
        <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(order.orderId)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;white-space:nowrap;">Order Total</td>
        <td style="padding:10px 14px;border:1px solid #ddd;">Rs. ${Number(order.total || 0).toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;white-space:nowrap;">Payment</td>
        <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(order.paymentMethod === 'bank' ? 'Bank Deposit' : 'Cash on Delivery')}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;font-weight:bold;white-space:nowrap;">Shipping</td>
        <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(order.shippingMethodName || 'Standard Shipping')}</td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
      <thead>
        <tr>
          <th style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;text-align:left;">Product</th>
          <th style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;text-align:left;">Size</th>
          <th style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;text-align:center;">Qty</th>
          <th style="padding:10px 14px;border:1px solid #ddd;background:#f5f5f5;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <p style="font-size:13px;color:#888;margin:0;">
      Questions about your order? Reply to this email and our concierge team will help you.
    </p>
    `
  );

  const lines = ['Thank you for your order!'];
  lines.push(`We've received your order ${order.orderId}.`);
  lines.push('');
  lines.push('Order details:');
  items.forEach((item) => {
    lines.push(
      `- ${item.title} (Size: ${item.size || '—'}) x${Number(item.quantity) || 1} = Rs. ${Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}`
    );
  });
  lines.push('');
  lines.push(`Order Total: Rs. ${Number(order.total || 0).toLocaleString()}`);
  lines.push(
    `Payment: ${order.paymentMethod === 'bank' ? 'Bank Deposit' : 'Cash on Delivery'}`
  );
  lines.push(`Shipping: ${order.shippingMethodName || 'Standard Shipping'}`);
  lines.push('');
  lines.push('Our concierge team will contact you shortly to confirm delivery details.');
  const text = lines.join('\n');
  return { html, text };
}