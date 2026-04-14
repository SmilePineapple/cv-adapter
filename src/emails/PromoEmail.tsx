import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
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
      <Preview>Still job hunting? Get unlimited tailored CVs for just £2.99/month</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>💼 Still job hunting?</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {name},</Text>
            
            <Text style={paragraph}>
              Applying to multiple roles? Each job is different — and your CV should be too. Upgrade to Pro and tailor your CV for every single application in minutes.
            </Text>

            <Text style={paragraph}>
              <strong>What you get with Pro — just £2.99/month:</strong>
            </Text>

            <Section style={benefitsList}>
              <Text style={benefit}>✅ <strong>Unlimited CV Generations</strong> — one for every role</Text>
              <Text style={benefit}>✅ <strong>Unlimited Cover Letters</strong></Text>
              <Text style={benefit}>✅ <strong>Interview Preparation</strong> with AI</Text>
              <Text style={benefit}>✅ <strong>All Export Formats</strong> (PDF, DOCX, HTML, TXT)</Text>
              <Text style={benefit}>✅ <strong>AI Review</strong> on every section</Text>
              <Text style={benefit}>✅ <strong>Premium Templates</strong> — stand out from the crowd</Text>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href="https://www.mycvbuddy.com/subscription">
                Upgrade to Pro — £2.99/month →
              </Button>
            </Section>

            <Text style={paragraph}>
              Rooting for you,
            </Text>
            <Text style={paragraph}>
              Jake @ My CV Buddy
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
