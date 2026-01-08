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

interface LimitReachedEmailProps {
  name: string
}

export default function LimitReachedEmail({ name }: LimitReachedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You've used your free generations - Upgrade to Pro for unlimited access! 🎯</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>You're on a Roll! 🎯</Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hi {name || 'there'},</Text>
            
            <Text style={paragraph}>
              You've used all your free CV generations! That's awesome - it means you're serious about landing your dream job.
            </Text>

            <Section style={statsBox}>
              <Text style={statsTitle}>Your Journey So Far:</Text>
              <Text style={statsItem}>✅ 2 CVs Generated</Text>
              <Text style={statsItem}>🎯 Ready for the next step</Text>
            </Section>

            <Section style={upgradeBox}>
              <Text style={upgradeTitle}>Unlock Unlimited Access</Text>
              <Text style={upgradeText}>
                Upgrade to Pro for just <strong>£5 one-time payment</strong>
              </Text>
              
              <Section style={benefitsSection}>
                <Text style={benefitItem}>✨ 100 CV Generations</Text>
                <Text style={benefitItem}>📝 Unlimited Cover Letters</Text>
                <Text style={benefitItem}>🎤 Interview Preparation</Text>
                <Text style={benefitItem}>🌍 50+ Languages</Text>
                <Text style={benefitItem}>📄 All Export Formats</Text>
              </Section>

              <Section style={promoBox}>
                <Text style={promoTitle}>🎉 Special Launch Offer!</Text>
                <Text style={promoCode}>
                  Use code <strong>LAUNCH50MONTHLY</strong>
                </Text>
                <Text style={promoDiscount}>
                  Get 50% OFF - Just £2.50!
                </Text>
              </Section>

              <Section style={ctaSection}>
                <Button style={button} href="https://www.mycvbuddy.com/subscription">
                  Upgrade to Pro Now
                </Button>
              </Section>

              <Text style={moneyBack}>
                💯 30-day money-back guarantee
              </Text>
            </Section>

            <Text style={paragraph}>
              Still not sure? Reply to this email and we'll help you decide if Pro is right for you.
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
  backgroundColor: '#fefce8',
  borderRadius: '12px',
  padding: '32px',
  margin: '24px 0',
  textAlign: 'center' as const,
  border: '2px solid #fbbf24',
}

const upgradeTitle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#92400e',
  marginBottom: '8px',
}

const upgradeText = {
  fontSize: '18px',
  color: '#78350f',
  marginBottom: '24px',
}

const benefitsSection = {
  textAlign: 'left' as const,
  margin: '24px auto',
  maxWidth: '300px',
}

const benefitItem = {
  fontSize: '16px',
  lineHeight: '28px',
  color: '#334155',
  margin: '8px 0',
}

const promoBox = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '2px dashed #f59e0b',
}

const promoTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#b45309',
  marginBottom: '8px',
}

const promoCode = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#92400e',
  marginBottom: '8px',
  fontFamily: 'monospace',
}

const promoDiscount = {
  fontSize: '16px',
  color: '#b45309',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 40px',
}

const moneyBack = {
  fontSize: '14px',
  color: '#059669',
  marginTop: '16px',
  fontWeight: 'bold',
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
