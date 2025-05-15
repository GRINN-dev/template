import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import { ThemedText } from "../ThemedText";

export type BaseButtonProps = {
  type:
    | "solid"
    | "outlined"
    | "destructive"
    | "success"
    | "outlined-danger"
    | "brand-base"
    | "brand-secondary"
    | "brand-solid-secondary";
  title: string;
  onPress?: () => void;
  logo?: React.ReactNode;
  disable?: boolean;
  width?: string;
  loading?: boolean; // état loading
};

export const BaseButton = ({
  type,
  title,
  onPress,
  disable,
  logo,
  width,
  loading = false,
}: BaseButtonProps) => {
  const backgroundClass =
    type === "solid"
      ? "bg-primary border-primary"
      : type === "destructive"
        ? "bg-danger border-danger"
        : type === "success"
          ? "bg-success border-success"
          : type === "outlined-danger"
            ? "border-danger"
            : type === "brand-base"
              ? "border-brand-secondary"
              : type === "brand-secondary"
                ? "border-secondary"
                : type === "brand-solid-secondary"
                  ? "bg-secondary"
                  : "bg-white";

  const textColor =
    type === "solid" || type === "destructive" || type === "success"
      ? "white"
      : type === "outlined-danger"
        ? "#FF0000"
        : type === "brand-base"
          ? "#F3A712"
          : type === "brand-secondary"
            ? "#1F94A3"
            : type === "brand-solid-secondary"
              ? "white"
              : "#545F66";

  const border =
    type === "outlined" ? "border" : type === "outlined-danger" ? "border" : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable || loading}
      className={`relative h-[48px] ${width ? width : "w-full"} flex-row items-center justify-center gap-4 rounded-full ${border} px-4 ${
        disable || loading ? "opacity-40" : ""
      } ${backgroundClass}`}
    >
      {logo && logo}
      <ThemedText style={{ color: textColor }} type="defaultSemiBold">
        {title}
      </ThemedText>
      {loading && (
        <View className="absolute inset-0 flex items-center justify-center">
          <ActivityIndicator color={textColor} />
        </View>
      )}
    </TouchableOpacity>
  );
};
