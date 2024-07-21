import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Link,
  Text,
} from '@react-email/components';
import { serviceEmail } from '../src/env';

type EmailProps = {
  name: string;
  title: string;
  url: string;
};

const CourtPreparationEmail = ({
  name,
  title,
  url,
}: EmailProps) => (
  <Html lang="en">
    <Head />
    <Preview>Important: Your Court Case is Ready to Begin, {name}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          🏛️ Your Court Case is Ready, {name}!
        </Heading>
        <Text style={text}>
          We hope this email finds you well. We have some important news regarding your case.
        </Text>
        <Text style={text}>
          We're pleased to inform you that the preparations for your case, <strong>{title}</strong>, have been completed, and we're now ready to begin the proceedings. 🚀
        </Text>
        <Text style={text}>
          You can review the details of your case and participate in the proceedings by clicking the link below:
        </Text>
        <Link
          href={url}
          target="_blank"
          style={{
            ...link,
            display: 'inline-block',
            marginBottom: '16px',
          }}
        >
          Enter Your Court Session
        </Link>
        <Text style={text}>
          Our AI system is prepared to guide you through the process. If you need any assistance or have any questions, please don't hesitate to reach out.
        </Text>
        <Text style={text}>
          Remember, it's important to:
        </Text>
        <ul style={list}>
          <li>Review all case materials thoroughly</li>
          <li>Prepare any necessary statements or evidence</li>
          <li>Be punctual for all scheduled sessions</li>
        </ul>
        <Text style={text}>
          Thank you for choosing our service. We're committed to ensuring a fair and efficient process for all parties involved.
        </Text>
        <Text style={{ ...text, marginBottom: '14px' }}>
          Best regards,
        </Text>
        <Text style={signature}>
          Themis Team<br/>
          Email: <a href={`mailto:${serviceEmail.value()}`} style={signature} >{serviceEmail.value()}</a>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default CourtPreparationEmail;

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

const list = {
  ...text,
  paddingLeft: '30px',
};

const signature = {
  color: '#888',
  fontSize: '14px',
  fontStyle: 'italic',
};
