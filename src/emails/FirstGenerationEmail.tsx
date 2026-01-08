import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from '@react-email/components'

interface FirstGenerationEmailProps {
  name: string
}

export default function FirstGenerationEmail({ name }: FirstGenerationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Great job on your first CV! You have 1 more free generation 🚀</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Great Job! 🚀</Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {name || 'there'},</Text>
            
            <Text style={paragraph}>
              Congratulations on creating your first AI-powered CV! You're one step closer to landing your dream job.
            </Text>

            <Section style={statsBox}>
              <Text style={statsTitle}>Your Progress:</Text>
              <Text style={statsItem}>✅ 1 CV Generated</Text>
              <Text style={statsItem}>🎯 1 Free Generation Remaining</Text>
            </Section>

            <Text style={paragraph}>
              <strong>What's next?</strong>
            </Text>

            <Text style={paragraph}>
              • Download your CV in PDF, DOCX, or TXT format<br />
              • Create a personalized cover letter<br />
              • Prepare for interviews with our AI assistant<br />
              • Use your last free generation to optimize for another role
            </Text>

            <Section style={upgradeBox}>
              <Text style={upgradeTitle}>Want unlimited access?</Text>
              <Text style={upgradeText}>
                Upgrade to Pro for just £5 and get 100 CV generations!
              </Text>
              <Text style={promoText}>
                💰 Use code <strong>LAUNCH50MONTHLY</strong> for 50% off!
              </Text>
              <Section style={ctaSection}>
                <Button style={button} href="https://www.mycvbuddy.com/subscription">
                  Upgrade to Pro - £5
                </Button>
              </Section>
            </Section>

            <Text style={paragraph}>
              Need help? Just reply to this email!
            </Text>

            <Text style={paragraph}>
              Best regards,<br />
              The CV Buddy Team
            </Text>
          </Section>

          <Section style={footer}>
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
  backgroundColor: '#10b981',
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

const statsBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  borderLeft: '4px solid #10b981',
}

const statsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#065f46',
  marginBottom: '12px',
}

const statsItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#334155',
  margin: '8px 0',
}

const upgradeBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const upgradeTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#92400e',
  marginBottom: '8px',
}

const upgradeText = {
  fontSize: '16px',
  color: '#78350f',
  marginBottom: '12px',
}

const promoText = {
  fontSize: '16px',
  color: '#b45309',
  marginBottom: '16px',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '16px 0',
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
