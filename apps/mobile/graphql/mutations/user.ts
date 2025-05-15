import { graphql } from "@/graphql";

const UpdateUserMutationUnpersisted = graphql(`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
      }
    }
  }
`);

const SaveMyNewContactsUnpersisted = graphql(`
  mutation SaveMyNewContacts($input: SaveMyNewContactsInput!) {
    saveMyNewContacts(input: $input) {
      clientMutationId
    }
  }
`);

const AddInMyContactsUnpersisted = graphql(`
  mutation AddInMyContacts($userId: UUID!) {
    addInMyContacts(input: { pUserId: $userId }) {
      clientMutationId
    }
  }
`);

const RemoveFromMyContactsUnpersisted = graphql(`
  mutation RemoveFromMyContacts($id: UUID!) {
    removeFromMyContacts(input: { pUserId: $id }) {
      clientMutationId
    }
  }
`);

const DeletePreRegisteredContactUnpersisted = graphql(`
  mutation DeletePreRegisteredContact($id: UUID!) {
    deletePreRegisteredContact(input: { id: $id }) {
      clientMutationId
    }
  }
`);

export const UpdateUserMutation = graphql.persisted(
  "sha256:a5cf16d70958d1d28dd15822d3237c7c6dcf5bc7724ec98a882352ffb6910f54",
  UpdateUserMutationUnpersisted,
);

export const SaveMyNewContacts = graphql.persisted(
  "sha256:b8c886c11e076abfc27c3ee378b2ec642c7e7f1ebaddcc4b567e7e29413f3fc1",
  SaveMyNewContactsUnpersisted,
);

export const AddInMyContacts = graphql.persisted(
  "sha256:6eb692edaa25de237fcccb82f0ae3b5e7dad6d9890a7f0e6a51aa0cdbaab27b5",
  AddInMyContactsUnpersisted,
);

export const RemoveFromMyContacts = graphql.persisted(
  "sha256:cb8b86631accce3b4ab94cd531f48322445ac97141e073efe3a8d824d7cd50bd",
  RemoveFromMyContactsUnpersisted,
);

export const DeletePreRegisteredContact = graphql.persisted(
  "sha256:0f35540a33030f322dd029e98be15d6bc2aa21427d133814a03d13c7162013e9",
  DeletePreRegisteredContactUnpersisted,
);
