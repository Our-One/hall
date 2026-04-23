import { Resend } from 'resend';
import { env } from '@/lib/env';
import { createLogger } from '@/lib/logger';

const logger = createLogger('email');

let resend: Resend | null = null;

export function getResend(): Resend {
  if (!resend) {
    resend = new Resend(env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ id: string }> {
  const client = getResend();

  const { data, error } = await client.emails.send({
    from: 'Our One <noreply@our.one>',
    to,
    subject,
    html,
  });

  if (error) {
    logger.error('Failed to send email', error, { to, subject });
    throw new Error(`Failed to send email: ${error.message}`);
  }

  logger.info('Email sent', { to, subject, id: data?.id });
  return { id: data!.id };
}
