import { graphql } from "@/graphql";

const EventsQueryUnpersisted = graphql(`
  query EventsQuery($eventsFilter: EventFilter) {
    events(filter: $eventsFilter) {
      nodes {
        id
        title
        startAt
        description
        visibility
        getStatusOnEvent
        maxParticipants
        userEvents {
          totalCount
        }
        addresses {
          latitude
          longitude
        }
        sport {
          code
          color
          name
        }
      }
    }
  }
`);

const EventByIdQueryUnpersisted = graphql(`
  query EventById($id: UUID!) {
    event(id: $id) {
      id
      title
      description
      startAt
      visibility
      isClosed
      maxParticipants
      getStatusOnEvent
      organizerId
      organizer {
        id
        firstname
        lastname
        avatarUrl
        avatarColor
      }
      addressesId
      addresses {
        formattedAddress
        latitude
        longitude
      }
      sportId
      sport {
        id
        name
        color
        code
      }
      goingUsers: userEvents(condition: { status: GO }) {
        totalCount
        nodes {
          user {
            firstname
            lastname
            avatarColor
            avatarUrl
            id
          }
        }
      }
      userEvents(orderBy: CREATED_AT_DESC) {
        nodes {
          id
          user {
            id
            firstname
            lastname
            avatarColor
            avatarUrl
          }
        }
        totalCount
      }
    }
  }
`);

const UpcomingEventsQueryUnpersisted = graphql(`
  query UpcomingEventsQuery($offset: Int!) {
    getUpcomingEvents(first: 8, offset: $offset) {
      nodes {
        id
        title
        startAt
        organizerId
        getStatusOnEvent
        description
        visibility
        maxParticipants
        sport {
          name
        }
        userEvents(condition: { status: GO }) {
          totalCount
        }
        addresses {
          latitude
          longitude
        }
        sport {
          code
          color
          name
        }
      }
    }
  }
`);

const GetPreRegisteredUserByIdUnpersisted = graphql(`
  query GetPreRegisteredUserById($id: UUID!) {
    preRegisteredContact(id: $id) {
      id
      firstname
      lastname
      phoneNumber
    }
  }
`);

const GetUserByIdUnpersisted = graphql(`
  query GetUserById($id: UUID!) {
    user(id: $id) {
      id
      firstname
      lastname
      avatarUrl
      phoneNumber
      isInMySquad
      gender
    }
  }
`);

const UserContactQueryUnpersisted = graphql(`
  query UserContact($userID: UUID!, $offset: Int!, $first: Int!) {
    userContacts(
      filter: { userId: { equalTo: $userID } }
      offset: $offset
      first: $first
    ) {
      totalCount
      nodes {
        contact {
          avatarUrl
          avatarColor
          firstname
          id
          lastname
        }
      }
    }
  }
`);

const GetAllCategoriesQueryUnpersisted = graphql(`
  query GetAllCategories {
    categories(orderBy: ORDER_IDX_ASC) {
      nodes {
        sports(orderBy: ORDER_IDX_ASC) {
          nodes {
            id
            code
            color
            name
          }
        }
      }
    }
  }
`);

const AllSportQueryUnpersisted = graphql(`
  query AllSportQuery {
    sports {
      nodes {
        id
        name
        code
      }
    }
  }
`);

const PastEventsQueryUnpersisted = graphql(`
  query PastEventsQuery($offset: Int!) {
    getPastEvents(first: 10, offset: $offset) {
      nodes {
        id
        title
        startAt
        organizerId
        getStatusOnEvent
        description
        visibility
        maxParticipants
        userEvents(condition: { status: GO }) {
          totalCount
        }
        addresses {
          latitude
          longitude
        }
        sport {
          code
          color
          name
        }
      }
    }
  }
`);

const GetFederUsersHasMePreRegisteredUnpersisted = graphql(`
  query GetFederUsersHasMePreRegistered($phoneNumber: String!) {
    preRegisteredContacts(condition: { phoneNumber: $phoneNumber }) {
      nodes {
        id
        inviter {
          phoneNumber
        }
      }
    }
  }
`);

const GetContactsFederByPhoneNumberUnpersisted = graphql(`
  query GetContactsFederByPhoneNumber(
    $pPhoneNumbersList: [String!]!
    $currentUserId: UUID!
  ) {
    getMobileContactFederByPhoneNumber(pPhoneNumbersList: $pPhoneNumbersList) {
      nodes {
        phoneNumber
        userContacts(condition: { contactId: $currentUserId }) {
          totalCount
          nodes {
            userId
          }
        }
      }
    }
  }
`);

const CheckExistingPhoneContactUnpersisted = graphql(`
  query CheckExistingPhoneContact($phoneNumbers: [String!]!) {
    chechExistingPhoneContact(phoneNumbers: $phoneNumbers)
  }
`);

const GetUserContactViewsUnpersisted = graphql(`
  query GetUserContactViews($offset: Int!) {
    currentUserId
    contactViews(offset: $offset, first: 20) {
      totalCount
      nodes {
        id
        avatarUrl
        createdAt
        firstname
        lastname
        phoneNumber
        source
        hasMeInTeam
      }
    }
  }
`);

const GetSuggestionsUnpersisted = graphql(`
  query GetSuggestions($offset: Int!) {
    currentUserId
    getSuggestions(first: 5, offset: $offset) {
      nodes {
        id
        avatarUrl
        firstname
        lastname
        source
      }
      totalCount
    }
  }
`);

const CheckPhoneNumberUnpersisted = graphql(`
  query CheckPhoneNumber($phoneNumber: String!) {
    users(condition: { phoneNumber: $phoneNumber }) {
      totalCount
    }
  }
`);

export const EventsQuery = graphql.persisted(
  "sha256:41b256eabbe5a7f08316276db67b163e44aec98205adf8d7f36c65b1bb604c2f",
  EventsQueryUnpersisted,
);

export const EventByIdQuery = graphql.persisted(
  "sha256:3ac3ccc06771da5f6f58e7c6f10b89dfdc5b45c46e07150957cf3d202c7bcdb7",
  EventByIdQueryUnpersisted,
);

export const GetPreRegisteredUserById = graphql.persisted(
  "sha256:9966f80c30f6bbd6d9fa3914defd3f9dd85e9cbfa630ca724fdb6e4abab97784",
  GetPreRegisteredUserByIdUnpersisted,
);

export const GetUserById = graphql.persisted(
  "sha256:57c7111e5a7aabc3e1e0cf778a2e529ec4da891cbc05b12640e5f55ab5f3abc4",
  GetUserByIdUnpersisted,
);

export const UserContactQuery = graphql.persisted(
  "sha256:9096dda0c3abaf297e35e5fccd62ddb3e81e07e321f7ad98964d11ca7c678cd5",
  UserContactQueryUnpersisted,
);

export const GetAllCategoriesQuery = graphql.persisted(
  "sha256:4e245b4b9a9a7ef606fcd38ec0dce8b1db3e589070cf76d632032f8ca345627b",
  GetAllCategoriesQueryUnpersisted,
);

export const AllSportQuery = graphql.persisted(
  "sha256:8414f2a47b60a3768cb9c02f66a6bae00d784dd7f8bfedf16284226aed796993",
  AllSportQueryUnpersisted,
);

export const UpcomingEventsQuery = graphql.persisted(
  "sha256:b757de16f001cff271b334a83ede2b2ed9128147e57170e483339116f8fe19c6",
  UpcomingEventsQueryUnpersisted,
);

export const PastEventsQuery = graphql.persisted(
  "sha256:32744c761ea41c837eb5d599c82c011ae19892acfed8e251164fe6280eb86e80",
  PastEventsQueryUnpersisted,
);

export const GetFederUsersHasMePreRegistered = graphql.persisted(
  "sha256:4db9df333731c04ff585ee8f037e399d5f77dd1cd6a6b26edbb82250bd7720f4",
  GetFederUsersHasMePreRegisteredUnpersisted,
);

export const GetContactsFederByPhoneNumber = graphql.persisted(
  "sha256:b6fed4467d916a0dc678eb88cd135c20fb74a7fb131a5a6030172993aaf3f735",
  GetContactsFederByPhoneNumberUnpersisted,
);

export const CheckExistingPhoneContact = graphql.persisted(
  "sha256:aa6fd8bce31900600b35fe34b4137e10528d4ff5187c25589b7d3d5cfcb24300",
  CheckExistingPhoneContactUnpersisted,
);

export const GetUserContactViews = graphql.persisted(
  "sha256:b0f4c7d0f9dc1e5a1d70ee000a5f061fd5981accdeee11626cb215f37e4d2a46",
  GetUserContactViewsUnpersisted,
);

export const GetSuggestions = graphql.persisted(
  "sha256:37fe4f91930be5b554ec759985b8b9367dd36d577c0620f26c5dfdb6916dabc8",
  GetSuggestionsUnpersisted,
);

export const CheckPhoneNumber = graphql.persisted(
  "sha256:b0874ce7dccaa407a049b2c819e85dd6a06cbe92e6eb025cb61e71d12c1d9126",
  CheckPhoneNumberUnpersisted,
);
