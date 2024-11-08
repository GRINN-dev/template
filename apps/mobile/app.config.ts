import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "starter",
  slug: "starter",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  scheme: "starter",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "tech.grinn.starter",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "tech.grinn.starter",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./src/assets/images/favicon.png",
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true,
  },
});
