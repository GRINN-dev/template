import { initGraphQLTada } from "gql.tada";

import type { introspection } from "../graphql-env.d.ts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigFloat: any;
    Cursor: any;
    Date: string;
    Datetime: string;
    JSON: { [key: string]: any };
    Jwt: string;
    UUID: string;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
