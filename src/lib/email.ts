// Placeholder email service. Replace with real SMTP implementation.

export interface EmailMessage {
  to: string
  subject: string
  html: string
}

export async function sendEmail(msg: EmailMessage): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!process.env.SMTP_HOST) {
    return { ok: false, error: 'SMTP not configured' }
  }
  // TODO: Implement real SMTP send
  console.log('Email (stub):', { to: msg.to, subject: msg.subject })
  return { ok: true }
}

