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

interface ConfirmationDeleteAccountProps {
  username: string;
  token: string;
  url: string;
}

export const ConfirmationDeleteAccount = ({
  username,
  token,
  url,
}: ConfirmationDeleteAccountProps) => {
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
                  <Heading>Confirmation de suppression de compte</Heading>
                  <Text>Bonjour {username},</Text>
                  <Text>Êtes-vous sûr de vouloir supprimer votre compte ?</Text>
                  <Text>
                    Pour confirmer la suppression de votre compte, cliquez sur
                    le bouton ci-dessous :
                  </Text>
                  <Button
                    href={`${url}?token=${token}`}
                    // TODO diriger vers page avec une troisieme etape de confirmation
                    className="rounded-full bg-black px-4 py-2 text-white"
                  >
                    Supprimer mon compte
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

export default ConfirmationDeleteAccount;
