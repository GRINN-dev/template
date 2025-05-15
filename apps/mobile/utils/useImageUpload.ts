import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { makeClient } from "@/components/apollo";
import { graphql } from "@/graphql";

const UploadMutation = graphql(`
  mutation GeneratePresignedPost($key: String!) {
    generatePresignedPost(input: { key: $key }) {
      fields
      url
    }
  }
`);

export const useImageUpload = (setImageUrl: (url: string) => void) => {
  const apolloClient = makeClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImageToS3 = async (image: ImagePicker.ImagePickerAsset) => {
    if (!image.uri) {
      throw new Error("Image URI is not available");
    }

    const fileName =
      image.fileName + Math.random().toString(36).substring(7) + ".jpg";

    try {
      const res = await apolloClient.mutate({
        mutation: UploadMutation,
        variables: { key: fileName },
      });

      if (!res.data?.generatePresignedPost) {
        throw new Error("No presigned post data received");
      }

      const { url, fields } = res.data.generatePresignedPost;

      const formData = new FormData();
      formData.append("Content-Type", image.type ?? "image/jpeg");
      Object.entries(fields ?? {}).forEach(([k, value]) => {
        formData.append(k, value as string);
      });

      formData.append("file", {
        uri: image.uri,
        type: "multipart/form-data",
        name: fileName,
      } as any);

      if (!url) {
        throw new Error("URL is not available");
      }
      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload image to S3`);
      }

      const uploadedImageUrl = `${url}/${fields?.key}`;
      setImageUrl(uploadedImageUrl);
    } catch (error) {
      setError("Oups, erreur de chargement de votre image.");
      throw error;
    }
  };

  const pickImage = async () => {
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const selectedImage = result.assets[0];
        await uploadImageToS3(selectedImage);
      } catch (error) {
        console.error("Error saving images:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return { pickImage, loading, error };
};
