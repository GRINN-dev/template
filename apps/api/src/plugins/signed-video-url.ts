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
import { loadOne } from "postgraphile/grafast";
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
export const VideoPresignedUrl = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      extend type Video {
        signedVideoUrl: String
      }
    `,
    /*     resolvers: {
      Video: {
        
        signedVideoUrl: async (
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
    }, */
    plans: {
      Video: {
        signedVideoUrl($product) {
          const $key = $product.get("video_url");

          return loadOne($key, (keys: string[]) => {
            return keys.map((key) =>
              getUrl({
                Bucket: process.env.BUCKET_NAME!,
                Key: key.split("/").pop(),
              }),
            );
          });
        },
      },
    },
  };
});
