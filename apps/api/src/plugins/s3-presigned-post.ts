import {
  GetObjectCommand,
  GetObjectRequest,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  createPresignedPost,
  PresignedPost,
  PresignedPostOptions,
} from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

// S3 Client Initialization
const client = new S3Client({
  endpoint:
    process.env.BUCKET_HOST || "https://cellar-c2.services.clever-cloud.com",
  region: "EU",
  credentials: {
    accessKeyId: process.env.BUCKET_KEY!,
    secretAccessKey: process.env.BUCKET_SECRET!,
  },
});

// Generate Presigned Post URL
const generateUrl = async (
  presignedPostOptions: PresignedPostOptions,
): Promise<PresignedPost> => {
  try {
    return await createPresignedPost(client, presignedPostOptions);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
};

// Get Presigned URL for Object
const getUrl = async (params: GetObjectRequest): Promise<string> => {
  try {
    const command = new GetObjectCommand(params);
    return await getSignedUrl(client, command, { expiresIn: 3600 * 2 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate signed URL");
  }
};

// GraphQL Plugin for Presigned URLs
export const GenerateVideoPresignedUrl = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      input GenerateVideoPresignedPostInput {
        key: String!
      }
      input GetVideoUrlInput {
        videoId: String!
      }
      type GenerateVideoPresignedPostPayload {
        url: String
        fields: JSON
      }
      type GetVideoUrlPayload {
        url: String
      }
      extend type Mutation {
        generateVideoPresignedPost(
          input: GenerateVideoPresignedPostInput!
        ): GenerateVideoPresignedPostPayload
        getVideoUrl(input: GetVideoUrlInput!): GetVideoUrlPayload
      }
    `,
    resolvers: {
      Mutation: {
        generateVideoPresignedPost: async (
          _query,
          args,
          context: Grafast.Context,
          _resolveInfo,
        ) => {
          const { key } = args.input;

          try {
            const url = await generateUrl({
              Bucket: process.env.BUCKET_NAME!,
              Key: `${Math.random().toString(36).substring(2, 9)}_${key}`,
              Conditions: [
                { acl: "private" },
                ["starts-with", "$Content-Type", ""],
              ],
              Expires: 3600, // 1 hour
              Fields: { acl: "private" },
            });

            return { url: url.url, fields: url.fields };
          } catch (error) {
            console.error("Error in generateVideoPresignedPost:", error);
            throw new Error("Failed to generate presigned POST URL");
          }
        },
        getVideoUrl: async (
          _query,
          args,
          context: Grafast.Context,
          _resolveInfo,
        ) => {
          const { rootPgPool, pgSettings } = context;
          const { videoId } = args.input;

          try {
            const {
              rows: [video],
            } = await rootPgPool.query(
              `SELECT * FROM publ.videos WHERE id = $1`,
              [videoId],
            );

            if (!video) {
              throw new Error("Video not found");
            }

            if (!video.video_url) {
              throw new Error("No video URL");
            }

            const url = await getUrl({
              Bucket: process.env.BUCKET_NAME!,
              Key: video.video_url.split("/").pop()!,
            });

            return { url };
          } catch (error) {
            console.error("Error in getVideoUrl:", error);
            throw new Error("Failed to get video URL");
          }
        },
      },
    },
  };
});
