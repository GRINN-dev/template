import * as React from "react";
import { Button, Html, Img, Section, Tailwind } from "@react-email/components";

export function ResetPasswordNoEmail(): React.ReactElement {
  return (
    <Html>
      <Tailwind>
        <Section>
          <Img
            src="/static/logo.png"
            alt="logo"
            width="100"
            height="100"
            className="my-2"
          />
        </Section>
        <Button href="" className="rounded-full bg-black px-4 py-2 text-white">
          Envoyer
        </Button>
      </Tailwind>
    </Html>
  );
}

export default ResetPasswordNoEmail;
