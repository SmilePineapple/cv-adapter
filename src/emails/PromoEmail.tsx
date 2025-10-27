import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PromoEmailProps {
  name: string
}

export default function PromoEmail({ name }: PromoEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Only 4 days left! 50% off CV Buddy Pro - Limited time offer</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>⏰ Only 4 Days Left!</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {name},</Text>
            
            <Text style={paragraph}>
              This is your <strong>final reminder</strong> – our launch promotion ends in just <strong style={highlight}>4 days</strong>!
            </Text>

            <Section style={promoBox}>
              <Text style={promoTitle}>🎉 LAUNCH50MONTHLY</Text>
              <Text style={promoSubtitle}>50% OFF Your First Month</Text>
              <Text style={promoPrice}>
                <span style={strikethrough}>£9.99/month</span>
                <br />
                <span style={newPrice}>£4.99/month</span>
              </Text>
            </Section>

            <Text style={paragraph}>
              <strong>What you get with Pro:</strong>
            </Text>

            <Section style={benefitsList}>
              <Text style={benefit}>✅ <strong>100 CV Generations</strong> per month</Text>
              <Text style={benefit}>✅ <strong>Unlimited Cover Letters</strong></Text>
              <Text style={benefit}>✅ <strong>Interview Preparation</strong> with AI</Text>
              <Text style={benefit}>✅ <strong>All Export Formats</strong> (PDF, DOCX, HTML, TXT)</Text>
              <Text style={benefit}>✅ <strong>50+ Languages</strong> supported</Text>
              <Text style={benefit}>✅ <strong>Priority Support</strong></Text>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href="https://www.mycvbuddy.com/pricing">
                Upgrade to Pro Now - Save 50%
              </Button>
            </Section>

            <Text style={urgency}>
              ⚠️ <strong>This offer expires in 4 days.</strong> After that, the price returns to £9.99/month.
            </Text>

            <Text style={paragraph}>
              Don't miss out on this limited-time opportunity to supercharge your job search!
            </Text>

            <Text style={paragraph}>
              Best regards,
              <br />
              The CV Buddy Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              CV Buddy - AI-Powered CV & Cover Letter Generator
            </Text>
            <Text style={footerText}>
              <Link href="https://www.mycvbuddy.com" style={link}>
                www.mycvbuddy.com
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href="https://www.mycvbuddy.com/unsubscribe" style={link}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 48px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
}

const content = {
  padding: '0 48px',
}

const greeting = {
  fontSize: '18px',
  lineHeight: '26px',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '16px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4b5563',
  marginBottom: '16px',
}

const highlight = {
  color: '#dc2626',
  fontWeight: 'bold',
}

const promoBox = {
  backgroundColor: '#fef3c7',
  border: '3px solid #f59e0b',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const promoTitle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 8px 0',
  letterSpacing: '1px',
}

const promoSubtitle = {
  fontSize: '16px',
  color: '#78350f',
  margin: '0 0 16px 0',
}

const promoPrice = {
  fontSize: '18px',
  color: '#78350f',
  margin: '0',
}

const strikethrough = {
  textDecoration: 'line-through',
  color: '#9ca3af',
}

const newPrice = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#dc2626',
}

const benefitsList = {
  margin: '16px 0 24px 0',
}

const benefit = {
  fontSize: '16px',
  lineHeight: '28px',
  color: '#374151',
  margin: '8px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

const urgency = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#dc2626',
  backgroundColor: '#fee2e2',
  padding: '16px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const footer = {
  padding: '24px 48px',
  borderTop: '1px solid #e5e7eb',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#6b7280',
  margin: '4px 0',
}

const link = {
  color: '#7c3aed',
  textDecoration: 'underline',
}
