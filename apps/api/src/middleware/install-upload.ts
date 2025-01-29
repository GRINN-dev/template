import type { Express, Request } from "express";
import multer from "multer";
import sharp from "sharp";
import slugify from "slugify";

import { uploadFile } from "../utils/upload";
import { getRootPgPool } from "./install-database-pools";

// Multer adds a body object and a file or files object to the request object.
// The memory storage engine stores the files in memory as Buffer objects.
// we will use it to store the file in memory and then resize it before putting it in the S3 bucket and storing it in the database
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: storage });
// the file info will contain a field called buffer that contains the entire file
// we will use upload.single("file") to get the file from the request. If we have multiple files, we can use upload.array("files", 5) to get 5 files for example

export default (app: Express) => {
  app.post(
    "/upload",
    uploadMiddleware.single("file"),
    async (
      req: Request<
        object,
        object,
        {
          file: Express.Multer.File;
          alt: string;
          caption: string;
          assetFolderId: string;
          slug?: string;
        }
      >,
      res,
    ) => {
      const now = String(Date.now());
      const rootPgPool = getRootPgPool(app);
      const file = req.file;
      const { alt, caption } = req.body;
      // + folder_id (optional)

      // form input : file, alt, caption
      // file example: {path: "./IMG_7837.PNG", relativePath: "./IMG_7837.PNG", lastModified: 1732893818000, name: "IMG_7837.PNG", size: 703107, type: "image/png"}

      try {
        const fileFormats = [
          { width: 1000, height: 1000, sizeLabel: "lg" },
          { width: 500, height: 500, sizeLabel: "md" },
          { width: 350, height: 350, sizeLabel: "sm" },
          { width: 250, height: 250, sizeLabel: "xs" },
          { width: 128, height: 128, sizeLabel: "thumbnail" },
        ];

        if (file) {
          let formats;
          let imgWidth;
          let imgHeight;
          // if file.mimetype is an image, we will resize it to 5 files with the following formats: lg (1000x1000) md (500x500) sm (350x350) xs (250x250) thumbnail (128x128)
          if (file.mimetype.startsWith("image/")) {
            const { width: originalWidth, height: originalHeight } =
              await sharp(file.buffer).metadata();

            imgWidth = originalWidth;
            imgHeight = originalHeight;

            const uploadedFiles = await Promise.all(
              fileFormats.map(async ({ width, height, sizeLabel }) => {
                // Resize the image using Sharp
                // todo: if width or height original dimension is smaller than the target dimension, the image will not be resized
                if (
                  !originalWidth ||
                  !originalHeight ||
                  originalWidth < width ||
                  originalHeight < height
                ) {
                  return;
                }

                const resizedBuffer = await sharp(file.buffer)
                  .resize(width, height, {
                    fit: "inside",
                  })
                  .toBuffer();
                const resizedMetadata = await sharp(resizedBuffer).metadata();

                // Generate a unique key for the resized image
                const filePath = `${req.body.slug}/${sizeLabel}`;
                const fileKey = slugify(`${now}_${file.originalname}`);

                // store the image
                const fileUrl = await uploadFile(
                  resizedBuffer,
                  file.mimetype,
                  filePath,
                  fileKey,
                );

                return {
                  width: resizedMetadata.width,
                  height: resizedMetadata.height,
                  sizeLabel,
                  fileKey,
                  fileUrl,
                };
              }),
            );
            formats = JSON.stringify(
              uploadedFiles
                .filter((file) => !!file)
                .map(({ sizeLabel, width, height, fileUrl }) => ({
                  [sizeLabel]: { width, height, fileUrl },
                })),
            );
          }

          // else, it's not an image then we store the file in the bucket then in the database without resizing it
          const filePath = `${req.body.slug}`;
          const fileKey = slugify(`${now}_${file.originalname}`);
          const fileUrl = await uploadFile(
            file.buffer,
            file.mimetype,
            filePath,
            fileKey,
          );
          const { rows } = await rootPgPool.query<{
            id: number;
            url: string;
            key: string;
            mime_type: string;
            size: number;
            formats: string;
            alt: string;
            caption: string;
          }>(
            `INSERT INTO publ.assets (name, url, key, mime_type, size, formats, alt, caption, asset_folder_id, width, height)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, url, key, mime_type, size, formats, alt, caption, asset_folder_id, width, height;
          `,
            [
              fileKey,
              fileUrl,
              `${filePath}/${fileKey}`,
              file.mimetype,
              file.size,
              formats,
              alt,
              caption,
              req.body.assetFolderId,
              imgWidth,
              imgHeight,
            ],
          );
          if (!rows.length) {
            throw new Error("Failed to store the file in database");
          }
          res.status(200).send({
            message: "File uploaded",
            data: rows[0],
          });
        } else {
          // no file was uploaded or the file is invalid
          throw new Error("Invalid file");
        }
      } catch (error) {
        console.error("Upload failed", error);
        res.status(500).send({ error: "Upload failed" });
      }
    },
  );
};
