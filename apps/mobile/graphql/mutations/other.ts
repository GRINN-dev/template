import { graphql } from "@/graphql";

const UploadMutationUnpersisted = graphql(`
  mutation GeneratePresignedPost($key: String!) {
    generatePresignedPost(input: { key: $key }) {
      fields
      url
    }
  }
`);

export const UploadMutation = graphql.persisted(
  "sha256:96ff55608408eb2ff31e7865060c30540deae6dbcfe9fed682d96494375ef9f0",
  UploadMutationUnpersisted,
);

const UpdateNotificationUnpersisted = graphql(`
  mutation UpdateNotification($input: UpdateNotificationInput!) {
    updateNotification(input: $input) {
      clientMutationId
    }
  }
`);

export const UpdateNotification = graphql.persisted(
  "sha256:804651fb3c1b2389594f3474e7b01ac7cef66aae09d3b76f1261087b3e2cd294",
  UpdateNotificationUnpersisted,
);
