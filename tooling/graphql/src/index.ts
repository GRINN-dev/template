import { initGraphQLTada } from "gql.tada";

import { introspection } from "../graphql-env";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
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
