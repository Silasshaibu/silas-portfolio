import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveContactSubmission } from '@/lib/neon';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await saveContactSubmission({ name, email, projectType, message });

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'silasshaibu30bg@gmail.com',
      replyTo: email,
      subject: `New inquiry from ${name} — ${projectType}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">New Portfolio Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #555; width: 120px;"><strong>Name</strong></td><td>${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #555;"><strong>Project Type</strong></td><td>${projectType}</td></tr>
          </table>
          <div style="margin-top: 16px;">
            <strong>Message:</strong>
            <p style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-top: 8px;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Sent from portfolio.swade-art.com — reply directly to respond to ${name}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Contact API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
