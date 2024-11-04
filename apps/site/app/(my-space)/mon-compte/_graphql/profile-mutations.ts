import { graphql } from "@grinn/graphql";

export const updateProfileMutation = graphql(`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        username
        name
        avatarUrl
        updatedAt
      }
    }
  }
`);
