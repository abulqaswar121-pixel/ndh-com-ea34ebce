import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

export interface NoticeEmailProps {
  siteName: string
  siteUrl: string
  preview: string
  heading: string
  intro: string
  details?: { label: string; value: string }[]
  body?: string[]
  ctaLabel?: string
  ctaUrl?: string
  footnote?: string
}

export const NoticeEmail = ({
  siteName,
  siteUrl,
  preview,
  heading,
  intro,
  details = [],
  body = [],
  ctaLabel,
  ctaUrl,
  footnote,
}: NoticeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{heading}</Heading>
        <Text style={text}>{intro}</Text>
        {body.map((paragraph, index) => (
          <Text key={index} style={text}>
            {paragraph}
          </Text>
        ))}
        {details.length > 0 && (
          <>
            <Hr style={hr} />
            {details.map((detail) => (
              <Text key={detail.label} style={detailRow}>
                <strong>{detail.label}:</strong> {detail.value}
              </Text>
            ))}
            <Hr style={hr} />
          </>
        )}
        {ctaLabel && ctaUrl && (
          <Button className="dm-btn" style={button} href={ctaUrl}>
            {ctaLabel}
          </Button>
        )}
        {footnote && <Text style={footer}>{footnote}</Text>}
        <Text style={footer}>
          <Link href={siteUrl} style={link}>
            {siteName}
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default NoticeEmail

const main: React.CSSProperties = {
  backgroundColor: '#f5f7fb',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '24px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e3e8f0',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
}

const h1: React.CSSProperties = {
  color: '#0b1220',
  fontSize: '22px',
  fontWeight: 700,
  margin: '0 0 16px',
}

const text: React.CSSProperties = {
  color: '#26303f',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 14px',
}

const detailRow: React.CSSProperties = {
  color: '#26303f',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 6px',
}

const hr: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #e3e8f0',
  margin: '20px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#1552f0',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  padding: '12px 22px',
  textDecoration: 'none',
}

const link: React.CSSProperties = {
  color: '#1552f0',
  textDecoration: 'underline',
}

const footer: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '20px 0 0',
}

const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    body { background-color: #0b1220 !important; }
    .dm-btn { background-color: #1552f0 !important; color: #ffffff !important; }
  }
`
