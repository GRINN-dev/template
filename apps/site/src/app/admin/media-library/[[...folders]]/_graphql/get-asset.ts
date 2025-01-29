import { graphql } from "@grinn/graphql";

export const getAsset = graphql(`
  query GetAsset($id: UUID!) {
    asset(id: $id) {
      id
      name
      mimeType
      size
      height
      width
      url
    }
  }
`);
