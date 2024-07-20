import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

type EmailProps = {
  name: string;
  title: string;
  roomId: string;
  appUrl: string;
}

/**
 * Case Finished Email
 */
const CourtFinishedEmail = ({
  name,
  title,
  roomId,
  appUrl,
}: EmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>Good News, {name}! Your Court Has Been Finished!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          🎉 Good News, {name}!
        </Heading>
        <Text style={text}>
          We've got exciting news for you! 🎊
        </Text>
        <Text style={text}>
          We're pleased to inform you that your case, <strong>{title}</strong>, has now been officially finished! 🚀
        </Text>
        <Text style={text}>
          You can review the details of your case by clicking the link below:
        </Text>
        <Link
          href={`${appUrl}/${roomId}/battles`}
          target="_blank"
          style={{
            ...link,
            display: 'inline-block',
            marginBottom: '16px',
          }}
        >
          Review Your Case Details
        </Link>
        <Text style={text}>
          Our AI system has completed the process, and we're here if you need any further information or assistance. Just let us know!
        </Text>
        <Text style={text}>
          Thanks for choosing our service. Wishing you a wonderful day! 🌟
        </Text>
        <Text style={{ ...text, marginBottom: '14px' }}>
          Best regards,
        </Text>
        <Text style={signature}>
          Themis Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default CourtFinishedEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '40px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '12px',
};

const link = {
  color: '#2754C5',
  fontWeight: '600',
  fontSize: '16px',
  textDecoration: 'underline',
};

const signature = {
  color: '#888',
  fontSize: '14px',
  fontStyle: 'italic',
};
