/** Send an email notification via the API route */
export async function sendNotification(
  subject: string,
  body: string,
  to?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 16px;">OpenBrokerTrack</h2>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 12px;">Loan Status Update</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
          <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 15px;">${subject}</h3>
          <p style="color: #475569; margin: 0 0 16px; font-size: 13px; line-height: 1.6;">${body}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            This is an automated notification from OpenBrokerTrack.
          </p>
        </div>
      </div>
    `;

    const res = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html, to }),
    });

    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error };
    return { success: true };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
