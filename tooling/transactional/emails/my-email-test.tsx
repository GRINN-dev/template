import * as React from "react";
import { Button, Html, Img, Section } from "@react-email/components";

export const MyEmail = () => {
  return (
    <Html>
      <Section>
        <Img
          src="/static/logo.png"
          alt="logo"
          width="100"
          height="100"
          className="my-2"
        />
      </Section>
      <Button
        href="https://example.com"
        style={{
          background: "#000",
          color: "#fff",
          padding: "12px 20px",
          margin: "20px 0",
          borderRadius: "5px",
        }}
      >
        Cliquez moi donc
      </Button>
    </Html>
  );
};

export default MyEmail;
