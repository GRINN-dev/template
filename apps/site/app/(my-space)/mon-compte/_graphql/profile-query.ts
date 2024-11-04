import { graphql } from "@grinn/graphql";

export const profileQuery = graphql(`
  query Profile {
    currentUser {
      id
      username
      name
      avatarUrl
      isAdmin
      isVerified
      createdAt
      updatedAt
      userAuthentications(first: 10) {
        nodes {
          id
          service
        }
      }
      userEmails(first: 10) {
        nodes {
          id
          email
          isVerified
          isPrimary
        }
      }
      videos(first: 10) {
        nodes {
          id
          title
          signedVideoUrl
          createdAt
          updatedAt
        }
      }
    }
  }
`);
