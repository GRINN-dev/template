import { graphql } from "@/graphql";

const CreateEventMutationUnpersisted = graphql(`
  mutation CreateEventMutation($input: CreateEventInput!) {
    createEvent(input: $input) {
      clientMutationId
      event {
        id
        title
      }
    }
  }
`);

const UpdateEventMutationUnpersisted = graphql(`
  mutation updateEventMutation($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      clientMutationId
      event {
        id
        title
      }
    }
  }
`);

const UpsertUserEventMutationUnpersisted = graphql(`
  mutation UpsertUserEventMutation($input: UpsertUserEventInput!) {
    upsertUserEvent(input: $input) {
      clientMutationId
    }
  }
`);

const DeleteEventMutationUnpersisted = graphql(`
  mutation DeleteEventMutation($input: DeleteEventInput!) {
    deleteEvent(input: $input) {
      clientMutationId
    }
  }
`);

const UpdateAnswerUserEventsUnpersisted = graphql(`
  mutation UpdateAnswerUserEvents($input: UpdateAnswerUserEventsInput!) {
    updateAnswerUserEvents(input: $input) {
      clientMutationId
    }
  }
`);

export const CreateEventMutation = graphql.persisted(
  "sha256:e19bea9cf29ee3ea905623a371e5935bb1e11723a1b4b8d3188eeba8bd8a0844",
  CreateEventMutationUnpersisted,
);

export const UpdateEventMutation = graphql.persisted(
  "sha256:1938c2ca86b72120d1b55999634137f2b0d8c29b4a9eca96ca68fde59d597ce6",
  UpdateEventMutationUnpersisted,
);

export const UpsertUserEventMutation = graphql.persisted(
  "sha256:ea8e79da73d83e13e11a736c711c4fa811a2881a635a6ecdb98bd10f20a1e3fa",
  UpsertUserEventMutationUnpersisted,
);

export const DeleteEventMutation = graphql.persisted(
  "sha256:f7bc75721d24bb2c0344324747b547e107d85b7ff323929fab62a80803939c45",
  DeleteEventMutationUnpersisted,
);

export const UpdateAnswerUserEvents = graphql.persisted(
  "sha256:48edbd79a8b1547016e569b067cbce04b69f9fc0aac5006d836f02413328c399",
  UpdateAnswerUserEventsUnpersisted,
);
