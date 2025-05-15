import { graphql } from "@/graphql";

const UpsertAddressMutationUnpersisted = graphql(`
  mutation UpsertAddress($input: UpsertAddressInput!) {
    upsertAddress(input: $input) {
      result {
        id
      }
    }
  }
`);

const AddressByIdQueryUnpersisted = graphql(`
  query AddressById($addressId: UUID!) {
    address(id: $addressId) {
      latitude
      longitude
      zipCode
      formattedAddress
      updatedAt
      city {
        name
      }
    }
  }
`);

export const AddressByIdQuery = graphql.persisted(
  "sha256:7e4c4bac698bb6b44487874068df48c4c0f7e42ef308cbe99bf82cf80cdbc174",
  AddressByIdQueryUnpersisted,
);

export const UpsertAddressMutation = graphql.persisted(
  "sha256:4808094066ce3aac353aadc1e666836671991c56189d7fea5aeccfb6161b6813",
  UpsertAddressMutationUnpersisted,
);
