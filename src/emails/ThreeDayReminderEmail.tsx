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

interface ThreeDayReminderEmailProps {
  name: string
}

export default function ThreeDayReminderEmail({ name }: ThreeDayReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Don't forget your free CV generation! 🚀</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Still looking for your dream job? 🎯</Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {name || 'there'},</Text>

            <Text style={paragraph}>
              We noticed you haven't created your AI-powered CV yet! You still have{' '}
              <strong>1 free generation</strong> waiting for you.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightTitle}>⏱️ It only takes 2 minutes to:</Text>
              <Text style={listItem}>• Upload your existing CV</Text>
              <Text style={listItem}>• Paste a job description</Text>
              <Text style={listItem}>• Get an ATS-optimized CV tailored to the role</Text>
            </Section>

            <Text style={paragraph}>
              <strong>Why wait?</strong> Our AI has helped thousands of job seekers land interviews
              by creating CVs that pass Applicant Tracking Systems and impress hiring managers.
            </Text>

            <Section style={ctaSection}>
              <Button style={button} href="https://www.mycvbuddy.com/dashboard">
                Create My CV Now →
              </Button>
            </Section>

            <Section style={tipBox}>
              <Text style={tipText}>
                <strong>💡 Pro Tip:</strong> Users who create their CV within the first week are
                3x more likely to land an interview!
              </Text>
            </Section>

            <Text style={paragraph}>
              Best regards,
              <br />
              The CV Buddy Team
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              CV Buddy - AI-Powered CV &amp; Cover Letter Generator
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
  backgroundColor: '#4F46E5',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
}

const content = {
  padding: '0 48px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
}

const highlightBox = {
  backgroundColor: '#f0f9ff',
  borderLeft: '4px solid #4F46E5',
  borderRadius: '4px',
  padding: '20px 24px',
  margin: '24px 0',
}

const highlightTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 12px 0',
}

const listItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1e40af',
  margin: '6px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
}

const tipBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '4px',
  padding: '20px 24px',
  margin: '24px 0',
}

const tipText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#92400e',
  margin: '0',
}

const footer = {
  padding: '24px 48px',
  borderTop: '1px solid #e5e7eb',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#6b7280',
  margin: '4px 0',
  textAlign: 'center' as const,
}

const link = {
  color: '#7c3aed',
  textDecoration: 'underline',
}
