import React from "react";
import { ActivityIndicator, Touchable, TouchableOpacity } from "react-native";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

import LeftIconDl from "@/assets/svg/leftIconDl.svg";
import { makeClient } from "@/components/apollo";
import { UploadMutation } from "@/graphql/mutations/other";
import { BaseButton } from "../ui/base-button";

interface UploadImageEventProps {
  imageUrl: string;
  setUploadImage: (url: string) => void;
  defaultImage?: any;
  title: string;
  avatarChildren?: React.ReactNode;
}

export const UploadImageEvent: React.FC<UploadImageEventProps> = ({
  imageUrl: imageUrls,
  setUploadImage: setImageUrl,
  defaultImage,
  title,
  avatarChildren,
}) => {
  const apolloClient = makeClient();
  const [error, setError] = React.useState("");
  const [imageLoading, setImageLoading] = React.useState(false);
  const [image, setImage] = React.useState("");

  const uploadImageToS3 = async (image: ImagePicker.ImagePickerAsset) => {
    if (!image.uri) {
      throw new Error("Image URI is not available");
    }
    console.log("image", image);
    const fileName =
      image.uri?.split("/").slice(-1) +
      Math.random().toString(36).substring(7) +
      ".jpg";
    const context = ImageManipulator.manipulate(image.uri);

    const w = image?.width ?? 0;
    const h = image?.height ?? 0;

    context.resize({
      ...(w <= h ? { width: 800 } : { height: 800 }),
    });
    const newImage = await context.renderAsync();
    const result = await newImage.saveAsync({
      format: SaveFormat.PNG,
      compress: 0.8,
    });
    try {
      const res = await apolloClient.mutate({
        mutation: UploadMutation,
        variables: { key: fileName },
      });
      if (!res.data?.generatePresignedPost) {
        throw new Error("No presigned post data received");
      }

      const { url, fields } = res.data.generatePresignedPost as {
        url: string;
        fields: { [key: string]: string };
      };

      const formData = new FormData();
      formData.append("Content-Type", image.type ?? "image/jpeg");
      Object.entries(fields).forEach(([k, value]) => {
        formData.append(k, value as string);
      });

      formData.append("file", {
        uri: result.uri,
        type: "multipart/form-data",
        name: fileName,
      } as any);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload image to S3: ${errorText}`);
      }

      const uploadedImageUrl = `${url}/${fields.key}`;
      console.log("uploadedImageUrl", uploadedImageUrl);
      return uploadedImageUrl;
    } catch (error) {
      setError(
        "Oups, erreur de chargement de votre image, ré-essayez plus tard",
      );
      throw error;
    }
  };

  const pickImage = async () => {
    setImageLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        let selectedImage;
        if (Array.isArray(result.assets) && result.assets.length > 0) {
          selectedImage = result.assets[0];
        } else {
          throw new Error("No image selected or assets format not recognized");
        }

        const s3Url = await uploadImageToS3(selectedImage!);
        setImageUrl(s3Url);
      } catch (error) {
        console.error("Error saving images:", error);
      } finally {
        setImageLoading(false);
      }
    } else {
      setImageLoading(false);
    }
  };

  if (imageLoading) {
    return <ActivityIndicator color={"#f1be77"} />;
  }

  if (avatarChildren) {
    return (
      <TouchableOpacity onPress={() => pickImage()} style={{ height: 128 }}>
        {avatarChildren}
      </TouchableOpacity>
    );
  }

  return (
    <BaseButton
      onPress={() => pickImage()}
      type={"outlined"}
      logo={<LeftIconDl />}
      title={title}
      loading={imageLoading}
      width={imageUrls ? "w-[160px]" : "w-full"}
    />
  );
};
