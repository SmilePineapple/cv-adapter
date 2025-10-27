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

interface ReEngagementEmailProps {
  name: string
  daysAgo: number
  remainingGenerations: number
}

export default function ReEngagementEmail({ 
  name, 
  daysAgo = 7,
  remainingGenerations = 1 
}: ReEngagementEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We miss you! Come back and use your free CV generation 👋</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>We Miss You! 👋</Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {name || 'there'},</Text>
            
            <Text style={paragraph}>
              It's been {daysAgo} days since you last visited CV Buddy. We hope everything is going well with your job search!
            </Text>

            <Section style={reminderBox}>
              <Text style={reminderTitle}>Don't forget:</Text>
              <Text style={reminderText}>
                You still have <strong>{remainingGenerations} free CV generation{remainingGenerations !== 1 ? 's' : ''}</strong> waiting for you!
              </Text>
            </Section>

            <Text style={paragraph}>
              <strong>Here's what you can do right now:</strong>
            </Text>

            <Section style={actionsBox}>
              <Text style={actionItem}>🎯 Generate a CV for a different role</Text>
              <Text style={actionItem}>📝 Create a personalized cover letter</Text>
              <Text style={actionItem}>🎤 Prepare for upcoming interviews</Text>
              <Text style={actionItem}>✨ Optimize your CV for ATS systems</Text>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href="https://www.mycvbuddy.com/dashboard">
                Continue Your Job Search
              </Button>
            </Section>

            <Section style={tipsBox}>
              <Text style={tipsTitle}>💡 Quick Job Search Tips:</Text>
              <Text style={tipItem}>
                • Tailor your CV for each job application
              </Text>
              <Text style={tipItem}>
                • Use keywords from the job description
              </Text>
              <Text style={tipItem}>
                • Keep your CV updated regularly
              </Text>
              <Text style={tipItem}>
                • Follow up on applications after 1 week
              </Text>
            </Section>

            <Text style={paragraph}>
              Need help or have questions? Just reply to this email!
            </Text>

            <Text style={paragraph}>
              Wishing you success in your job search,<br />
              The CV Buddy Team
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              <Link href="https://www.mycvbuddy.com" style={link}>mycvbuddy.com</Link>
            </Text>
            <Text style={footerText}>
              <Link href="https://www.mycvbuddy.com/unsubscribe" style={link}>Unsubscribe</Link>
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
  backgroundColor: '#f59e0b',
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

const reminderBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
  border: '2px solid #fbbf24',
}

const reminderTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#92400e',
  marginBottom: '12px',
}

const reminderText = {
  fontSize: '18px',
  color: '#78350f',
}

const actionsBox = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const actionItem = {
  fontSize: '16px',
  lineHeight: '28px',
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

const tipsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  borderLeft: '4px solid #6366f1',
}

const tipsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#4338ca',
  marginBottom: '12px',
}

const tipItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#334155',
  margin: '8px 0',
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
  marginBottom: '8px',
}

const link = {
  color: '#4F46E5',
  textDecoration: 'underline',
}
