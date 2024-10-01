import { sign } from "jsonwebtoken";

export interface Token {
  sub: string;
  sid?: string;
  iss?: string;
  exp?: string;
  aud?: string;
}
export const signToken = (
  payload: { sub: string; sid?: string },
  pgJwtSignOptions: {
    audience?: string;
    issuer?: string;
    expiresIn?: string;
  },
  secret: string,
) => {
  const defaultOptions = {
    audience: "postgraphile",
    issuer: "postgraphile",
    expiresIn: "15 minutes",
  };
  return sign(payload, secret, {
    ...defaultOptions,
    ...pgJwtSignOptions,
  });
};
