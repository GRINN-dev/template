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

interface ResetPasswordExistingEmailProps {
  username: string;
  url: string;
  token: string;
}

export const ResetPasswordExistingEmail = ({
  username,
  url,
  token,
}: ResetPasswordExistingEmailProps) => {
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
                  <Heading>Réinitialisation de mot de passe</Heading>
                  <Text>Bonjour {username},</Text>
                  <Text>
                    Vous avez demandé à réinitialiser votre mot de passe. Si
                    vous n'avez pas demandé de réinitialisation de mot de passe,
                    vous pouvez ignorer cet e-mail.
                  </Text>
                  <Text>
                    Pour réinitialiser votre mot de passe, cliquez sur le bouton
                    ci-dessous :
                  </Text>
                  <Button
                    href={`${url}?token=${token}`}
                    className="rounded-full bg-black px-4 py-2 text-white"
                  >
                    Réinitialiser mon mot de passe
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

export default ResetPasswordExistingEmail;
