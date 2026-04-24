import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BUSINESS } from '@/lib/config';
import { buildContactEmailHtml } from '@/lib/emailTemplate';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? '');
  try {
    const body = await request.json();
    const { name, email, phone, message, type, website } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      type?: string;
      website?: string;
    };

    if (website) return NextResponse.json({ success: true });

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'INVALID_EMAIL' }, { status: 400 });
    }

    const html = buildContactEmailHtml({ name, email, phone, message, type });

    const { error } = await resend.emails.send({
      from: `Massage Therapy - Contact <${BUSINESS.email}>`,
      to: BUSINESS.email,
      replyTo: email,
      subject: `Massage Therapy inquiry from ${name}`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'SEND_FAILED' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'SEND_FAILED' }, { status: 500 });
  }
}
