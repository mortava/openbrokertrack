import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'OpenBrokerTrack <notifications@defylocks.qualr.com>';
const DEFAULT_TO = ['defylocks@qualr.com'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, html, to } = body as {
      subject?: string;
      html?: string;
      to?: string[];
    };

    if (!subject || !html) {
      return NextResponse.json(
        { error: 'subject and html are required' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: to ?? DEFAULT_TO,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
