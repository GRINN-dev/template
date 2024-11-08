import * as React from "react";
import { Button, Html, Tailwind } from "@react-email/components";

export const ResetPasswordNoEmail = () => {
  return (
    <Html>
      <Tailwind>
        <Button href="" className="rounded-full bg-black px-4 py-2 text-white">
          Envoyer
        </Button>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordNoEmail;
