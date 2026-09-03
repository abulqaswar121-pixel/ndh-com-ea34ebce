import * as React from 'react'
import { render } from '@react-email/render'
import { NoticeEmail, type NoticeEmailProps } from '@/lib/email-templates/notice'

const SITE_NAME = 'Najeeb Digital Hub'
const ROOT_DOMAIN = 'ndh.com.ng'
const SENDER_DOMAIN = 'notify.ndh.com.ng'
const FROM_DOMAIN = 'ndh.com.ng'

export const SITE_URL = `https://${ROOT_DOMAIN}`

export function adminNotificationEmail(): string {
  return process.env['ADMIN_NOTIFICATION_EMAIL'] || `hello@${ROOT_DOMAIN}`
}

type SendArgs = {
  to: string
  subject: string
  label: string
  replyTo?: string
} & Omit<NoticeEmailProps, 'siteName' | 'siteUrl'>

/**
 * Render a branded notice email and put it on the transactional queue.
 * Never throws: a failed notification must not break the user's action.
 */
export async function sendTransactionalEmail(args: SendArgs): Promise<{ queued: boolean }> {
  const { to, subject, label, replyTo, ...templateProps } = args
  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const element = React.createElement(NoticeEmail, {
      ...templateProps,
      siteName: SITE_NAME,
      siteUrl: SITE_URL,
    })
    const html = await render(element)
    const text = await render(element, { plainText: true })
    const messageId = crypto.randomUUID()

    await (supabaseAdmin as any).from('email_send_log').insert({
      message_id: messageId,
      template_name: label,
      recipient_email: to,
      status: 'pending',
    })

    const { error } = await (supabaseAdmin as any).rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: messageId,
        to,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        html,
        text,
        purpose: 'transactional',
        label,
        queued_at: new Date().toISOString(),
      },
    })

    if (error) {
      console.error('Failed to enqueue transactional email', { label, code: error.code, message: error.message })
      await (supabaseAdmin as any).from('email_send_log').insert({
        message_id: messageId,
        template_name: label,
        recipient_email: to,
        status: 'failed',
        error_message: 'Failed to enqueue email',
      })
      return { queued: false }
    }
    return { queued: true }
  } catch (error) {
    console.error('Transactional email failed', { label, error })
    return { queued: false }
  }
}
