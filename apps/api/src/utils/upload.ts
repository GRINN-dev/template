/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from "fs";
import path from "path";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.BUCKET_HOST!,
  region: "EU",
  credentials: {
    accessKeyId: process.env.BUCKET_KEY!,
    secretAccessKey: process.env.BUCKET_SECRET!,
  },
});

export async function uploadFile(
  buffer: Buffer,
  mimeType: string,
  filePath: string,
  fileKey: string,
): Promise<string> {
  if (process.env.FILE_STORAGE === "s3") {
    // S3 upload
    const params: PutObjectCommandInput = {
      Bucket: process.env.BUCKET_NAME!,
      Key: `${filePath}/${fileKey}`,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read",
    };
    await s3Client.send(new PutObjectCommand(params));
    return `${process.env.BUCKET_HOST}/${process.env.BUCKET_NAME}/${filePath}/${fileKey}`;
  } else {
    // Local file system upload
    const uploadPath = path.join(__dirname, "../uploads", filePath);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    fs.writeFileSync(`uploads/${filePath}/${fileKey}`, buffer);
    return `${process.env.SERVER_URL!}/${filePath}/${fileKey}`;
  }
}
