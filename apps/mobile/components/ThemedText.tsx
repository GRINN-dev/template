import type { TextProps } from "react-native";
import { StyleSheet, Text } from "react-native";

import { colorPrimary500 } from "@/constants/ColorsFeder";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "smallText"
    | "medium"
    | "default"
    | "title"
    | "defaultBold"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "error"
    | "xs/brand/medium"
    | "xl/brand/semibold"
    | "xs/brand/semibold"
    | "sm/brand/semibold"
    | "lg/brand/semibold"
    | "smSansSemibold"
    | "base/brand/semibold";
  font?: "font-inter";
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  font,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "smallText" ? styles.smallText : undefined,
        type === "medium" ? styles.medium : undefined,
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultBold" ? styles.defaultBold : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "error" ? { color: "#FF0000" } : undefined,
        type === "xl/brand/semibold" ? styles.xlBrandSemibold : undefined,
        type === "xs/brand/semibold" ? styles.xsBrandSemibold : undefined,
        type === "xs/brand/medium" ? styles.xsBrandMedium : undefined,
        type === "sm/brand/semibold" ? styles.smBrandSemiBold : undefined,
        type === "lg/brand/semibold" ? styles.lgBrandSemiBold : undefined,
        type === "base/brand/semibold" ? styles.baseBrandSemiBold : undefined,
        type === "smSansSemibold" ? styles.smSansSemibold : undefined,
        style,
      ]}
      {...rest}
      className={`${font} ${className}`}
    />
  );
}

const styles = StyleSheet.create({
  smallText: {
    fontSize: 12,
    lineHeight: 16,
    color: colorPrimary500,
  },
  medium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  default: {
    fontSize: 14,
    lineHeight: 20,
    color: colorPrimary500,
  },
  defaultBold: {
    fontSize: 16,
    lineHeight: 24,
    color: colorPrimary500,
    fontWeight: "600",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: colorPrimary500,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
    color: colorPrimary500,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorPrimary500,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  xsBrandSemibold: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Figtree_700Bold_Italic",
  },
  xlBrandSemibold: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Figtree_700Bold_Italic",
  },
  xsBrandMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Figtree_500Medium_Italic",
  },
  smBrandSemiBold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Figtree_700Bold_Italic",
  },
  lgBrandSemiBold: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Figtree_700Bold_Italic",
  },
  baseBrandSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Figtree_700Bold_Italic",
  },
  smSansSemibold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    color: colorPrimary500,
  },
});
