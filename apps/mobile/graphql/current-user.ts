import { graphql } from "@/graphql";

const CurrentUserQueryUnpersisted = graphql(`
  query CurrentUser {
    currentUser {
      id
      email
      firstname
      lastname
      phoneNumber
      notificationResponseDate
      avatarUrl
      avatarColor
      gender
      profileValidated
      isPhoneCodeUsed
      pushToken
      appVersion
      userContacts {
        totalCount
      }
      userAuthentications {
        nodes {
          service
        }
      }
      preRegisteredContactsByInviterId {
        totalCount
      }
    }
  }
`);

export const CurrentUserQuery = graphql.persisted(
  "sha256:373ce59aa1df4d973240017181b1a03bb0b3142719ac1b62c5e30ea2f04ffc9c",
  CurrentUserQueryUnpersisted,
);

const GetAwaitingRepliesUnpersisted = graphql(`
  query GetAwaitingReplies {
    getAwaitingReplies
  }
`);

export const GetAwaitingReplies = graphql.persisted(
  "sha256:8bcd8da57c23b340de13ae3fe893d983e952cbcae91be20ae08fc73eea8d0349",
  GetAwaitingRepliesUnpersisted,
);

const GetNewSuggestionCountUnpersisted = graphql(`
  query GetNewSuggestionCount {
    getNewSuggestions
  }
`);

export const GetNewSuggestionCount = graphql.persisted(
  "sha256:24be89bd7ad934c0a2d431e45ee42fd0640b99cb1a87a6dcb0c5348ad2ce3e70",
  GetNewSuggestionCountUnpersisted,
);
