// "use client";

// import { useState } from "react";
// import { Upload } from "lucide-react";
// import { useForm } from "react-hook-form";

// import { graphql } from "@grinn/graphql";
// import client from "@/graphql/apollo-client";
// import { Button } from "./ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Progress } from "./ui/progress";
// import { Textarea } from "./ui/textarea";
// import { toast } from "./ui/use-toast";

// export function UploadVideoForm() {
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [file, setFile] = useState<File | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string | null>(null);
//   const form = useForm({
//     defaultValues: {
//       title: "",
//     },
//   });

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upload New Video</CardTitle>
//         <CardDescription>Share your latest road trip adventure</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form
//           onSubmit={form.handleSubmit((data) => {
//             if (!file) {
//               return;
//             }
//             uploadToS3(file, setUploadProgress).then((videoUrl) => {
//               setVideoUrl(videoUrl);
//               client
//                 .mutate({
//                   mutation: postVideoMutation,
//                   variables: {
//                     input: {
//                       title: data.title,
//                       videoUrl,
//                     },
//                   },
//                 })
//                 .then(() => {
//                   toast({ title: "Video uploaded" });
//                   setVideoUrl(null);
//                 })
//                 .catch(() => {
//                   toast({
//                     title: "Error uploading video",
//                     variant: "destructive",
//                   });
//                 });
//               setUploadProgress(0);
//               form.reset();
//             });
//           })}
//           className="space-y-4"
//         >
//           <div className="space-y-2">
//             <Label htmlFor="video">Video File</Label>
//             <Input
//               id="video"
//               type="file"
//               accept="video/*"
//               required
//               onChange={(event) => {
//                 const file = event.target.files?.[0];
//                 if (file) {
//                   setFile(file);
//                 }
//               }}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="title">Video Title</Label>
//             <Input
//               id="title"
//               placeholder="My Epic Road Trip"
//               required
//               {...form.register("title", { required: true })}
//             />
//           </div>

//           <Button type="submit" className="w-full">
//             <Upload className="mr-2 h-4 w-4" />
//             Upload Video
//           </Button>
//         </form>
//       </CardContent>
//       <CardFooter>
//         {uploadProgress > 0 && (
//           <div className="w-full space-y-2">
//             <Progress value={uploadProgress} className="w-full" />
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Uploading... {uploadProgress}%
//             </p>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

// const getS3presignedPost = graphql(`
//   mutation GetS3PressignedPost {
//     generateVideoPresignedPost(input: { key: "video.mp4" }) {
//       url
//       fields
//     }
//   }
// `);

// export const uploadToS3 = async (
//   file: File,
//   setProgress: (progress: number) => void,
// ): Promise<string> => {
//   // Generate the presigned URL
//   const { data } = await client.mutate({
//     mutation: getS3presignedPost,
//   });

//   const presignedUrl = data?.generateVideoPresignedPost as {
//     url: string;
//     fields: Record<string, string>;
//   };

//   if (!presignedUrl) {
//     throw new Error("Error while generating presigned post");
//   }

//   // Prepare form data to upload the file
//   const formData = new FormData();
//   formData.append("Content-type", file?.type);
//   Object.entries(presignedUrl.fields).forEach(([key, value]: any) => {
//     formData.append(key, value);
//   });
//   formData.append("file", file);

//   // Use XMLHttpRequest to track the upload progress
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();

//     xhr.open("POST", presignedUrl.url, true);

//     // Track progress
//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const progress = (event.loaded / event.total) * 100;
//         setProgress(progress);
//       }
//     };

//     xhr.onload = () => {
//       if (xhr.status === 204) {
//         resolve(presignedUrl.url + presignedUrl.fields.key);
//       } else {
//         reject(new Error("Upload failed"));
//       }
//     };

//     xhr.onerror = () => reject(new Error("Network error"));

//     xhr.send(formData);
//   });
// };

// const postVideoMutation = graphql(`
//   mutation PostVideo($input: VideoInput!) {
//     createVideo(input: { video: $input }) {
//       video {
//         id
//         videoUrl
//       }
//     }
//   }
// `);

"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileVideo, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

import { graphql } from "@grinn/graphql";

import client from "@/graphql/apollo-client";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { toast } from "./ui/use-toast";

export function UploadVideoForm() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!file) {
      toast({ title: "Please select a video file", variant: "destructive" });
      return;
    }
    uploadToS3(file, setUploadProgress).then((videoUrl) => {
      setVideoUrl(videoUrl);
      client
        .mutate({
          mutation: postVideoMutation,
          variables: {
            input: {
              title: data.title,
              videoUrl,
            },
          },
        })
        .then(() => {
          toast({ title: "Video uploaded successfully" });
          setVideoUrl(null);
          setFile(null);
        })
        .catch(() => {
          toast({
            title: "Error uploading video",
            variant: "destructive",
          });
        });
      setUploadProgress(0);
      form.reset();
    });
  });

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload New Video</CardTitle>
        <CardDescription>Share your latest road trip adventure</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              placeholder="My Epic Road Trip"
              required
              {...form.register("title", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Video File</Label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <AnimatePresence>
                {file ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <FileVideo className="h-8 w-8 text-blue-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag and drop your video here, or click to select a file
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <AnimatePresence>
          {uploadProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-2"
            >
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Uploading... {uploadProgress.toFixed(0)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
}

const getS3presignedPost = graphql(`
  mutation GetS3PressignedPost {
    generateVideoPresignedPost(input: { key: "video.mp4" }) {
      url
      fields
    }
  }
`);

export const uploadToS3 = async (
  file: File,
  setProgress: (progress: number) => void,
): Promise<string> => {
  // Generate the presigned URL
  const { data } = await client.mutate({
    mutation: getS3presignedPost,
  });

  const presignedUrl = data?.generateVideoPresignedPost as {
    url: string;
    fields: Record<string, string>;
  };

  if (!presignedUrl) {
    throw new Error("Error while generating presigned post");
  }

  // Prepare form data to upload the file
  const formData = new FormData();
  formData.append("Content-type", file?.type);
  Object.entries(presignedUrl.fields).forEach(([key, value]: any) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  // Use XMLHttpRequest to track the upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", presignedUrl.url, true);

    // Track progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 204) {
        resolve(presignedUrl.url + presignedUrl.fields.key);
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.send(formData);
  });
};

const postVideoMutation = graphql(`
  mutation PostVideo($input: VideoInput!) {
    createVideo(input: { video: $input }) {
      video {
        id
        videoUrl
      }
    }
  }
`);
