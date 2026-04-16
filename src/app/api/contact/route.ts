import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const TO_EMAIL = 'olyashelest22@gmail.com';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? '');
  try {
    const body = await request.json();
    const { name, email, phone, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF9F5; border: 1px solid #d4e6dc; border-radius: 8px;">
        <div style="background: #2D6A4F; padding: 24px 32px; border-radius: 6px 6px 0 0; margin: -32px -32px 32px -32px;">
          <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">
            New Website Inquiry
          </h1>
          <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 13px; font-family: sans-serif;">
            Olha Shelest — Massage Therapy Website
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; width: 110px; vertical-align: top;">Name</td>
            <td style="padding: 10px 0; color: #1a2e25;">${name}</td>
          </tr>
          <tr style="border-top: 1px solid #e8f3ed;">
            <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Email</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #2D6A4F;">${email}</a></td>
          </tr>
          ${phone ? `
          <tr style="border-top: 1px solid #e8f3ed;">
            <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Phone</td>
            <td style="padding: 10px 0; color: #1a2e25;">${phone}</td>
          </tr>` : ''}
          <tr style="border-top: 1px solid #e8f3ed;">
            <td style="padding: 10px 0; color: #5a7a6a; font-weight: 600; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; color: #1a2e25; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #d4e6dc; font-family: sans-serif; font-size: 12px; color: #999;">
          Sent from the contact form at olhashelest.com
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Website Contact <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
