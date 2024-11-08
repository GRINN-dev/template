import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface AccountValidationProps {
  username: string;
  url: string;
  token: string;
  userId: string;
}

export const AccountValidation = ({
  username,
  url,
  token,
  userId,
}: AccountValidationProps) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return (
    <Html>
      <Head />
      <Body>
        <Tailwind>
          <Container>
            <Section>
              <Img
                src="/static/logo.png"
                alt="logo"
                width="100"
                height="100"
                className="my-2"
              />
            </Section>
            <Section>
              <Row>
                <Column>
                  <Heading>Validation de compte</Heading>
                  <Text>Bonjour {username},</Text>
                  <Text>
                    Merci pour votre inscription. Pour valider votre compte,
                    cliquez sur le bouton ci-dessous :
                  </Text>
                  <Button
                    href={`${url}?token=${token}&userId=${userId}`}
                    className="rounded-full bg-black px-4 py-2 text-white"
                  >
                    Valider mon compte
                  </Button>
                </Column>
              </Row>
            </Section>
          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
};

export default AccountValidation;
