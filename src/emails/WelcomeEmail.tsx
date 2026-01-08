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

interface WelcomeEmailProps {
  name: string
  email: string
}

export default function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to CV Buddy - Your AI-Powered CV Assistant 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Welcome to CV Buddy! 🎉</Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {name || 'there'},</Text>
            
            <Text style={paragraph}>
              Welcome aboard! We're thrilled to have you join thousands of job seekers who are landing their dream jobs with AI-powered CVs.
            </Text>

            <Text style={paragraph}>
              <strong>You have 2 free CV generations to get started!</strong>
            </Text>

            <Section style={benefitsBox}>
              <Text style={benefitsTitle}>What you can do with CV Buddy:</Text>
              <Text style={benefitItem}>✅ Generate ATS-optimized CVs in seconds</Text>
              <Text style={benefitItem}>✅ Create personalized cover letters</Text>
              <Text style={benefitItem}>✅ Prepare for interviews with AI</Text>
              <Text style={benefitItem}>✅ Export to PDF, DOCX, or TXT</Text>
              <Text style={benefitItem}>✅ Support for 50+ languages</Text>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href="https://www.mycvbuddy.com/dashboard">
                Start Creating Your CV
              </Button>
            </Section>

            <Text style={paragraph}>
              Need help? Just reply to this email and we'll be happy to assist you!
            </Text>

            <Text style={paragraph}>
              Best regards,<br />
              The CV Buddy Team
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because you signed up for CV Buddy.
            </Text>
            <Text style={footerText}>
              <Link href="https://www.mycvbuddy.com" style={link}>mycvbuddy.com</Link>
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
  fontSize: '32px',
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

const benefitsBox = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const benefitsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e40af',
  marginBottom: '12px',
}

const benefitItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#334155',
  margin: '8px 0',
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
  padding: '14px 32px',
}

const footer = {
  padding: '0 48px',
  marginTop: '32px',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '24px',
}

const footerText = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#6b7280',
  textAlign: 'center' as const,
}

const link = {
  color: '#4F46E5',
  textDecoration: 'underline',
}
