import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Feder",
  slug: "feder",
  scheme:
    process.env.EXPO_PUBLIC_APP_VARIANT === "production"
      ? "feder"
      : "federstaging",
  version: "1.0.1",
  icon:
    process.env.EXPO_PUBLIC_APP_VARIANT === "staging"
      ? "./assets/images/feder-test-base-app-logo.png"
      : "./assets/images/feder-base-app-logo.png",
  userInterfaceStyle: "light",
  splash: {
    backgroundColor: "#4E6147",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier:
      process.env.EXPO_PUBLIC_APP_VARIANT === "production"
        ? "com.feder.mobile.app"
        : "com.grinn.feder",
    userInterfaceStyle: "light",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST ??
      "./assets/google-service/staging/GoogleService-Info.plist",
    usesAppleSignIn: true,
    config: {
      usesNonExemptEncryption: false,
      googleMapsApiKey: process.env.GOOGLE_API_KEY,
    },
    infoPlist: {
      NSUserTrackingUsageDescription:
        "Feder utilise ces données pour comprendre comment vous utilisez l’application et l'améliorer. Nous suivons par exemple les pages les plus vues",
      NSPhotoLibraryUsageDescription:
        "L'application accède à vos photos pour vous permettre de les partager avec les autres membres.",
      NSLocationWhenInUseUsageDescription:
        "Feder utilise votre position pour vous proposer des événements sportifs proches de chez vous.",
      NSLocationAlwaysUsageDescription:
        "Feder a besoin d'accéder à votre position même en arrière-plan pour mieux vous notifier d'événements proches.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Feder utilise votre position pour afficher les activités sportives proches de vous sur la carte.",
      MinimumOSVersion: "15.1",
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
          NSPrivacyAccessedAPITypeReasons: ["7D9E.1"],
        },
        {
          NSPrivacyAccessedAPIType:
            "NSPrivacyAccessedAPICategorySystemBootTime",
          NSPrivacyAccessedAPITypeReasons: ["3D61.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp",
          NSPrivacyAccessedAPITypeReasons: ["DDA9.1"],
        },
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
        },
      ],
    },
    buildNumber: "5",
  },
  android: {
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ??
      "./assets/google-service/staging/google-services.json",
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    package:
      process.env.EXPO_PUBLIC_APP_VARIANT === "production"
        ? "com.feder.app"
        : "com.grinn.feder",
    config: {
      googleMaps: {
        apiKey:
          process.env.GOOGLE_API_KEY ??
          "AIzaSyB31IOYP6Qy0kixMEffAz8c6GT8pxeV6Gk",
      },
    },
    // adaptiveIcon: {
    //   foregroundImage:
    //     process.env.EXPO_PUBLIC_APP_VARIANT === "staging"
    //       ? "./assets/images/feder-test-base-app-logo-512.png"
    //       : "./assets/images/feder-base-app-logo.png-512",
    //   backgroundColor: "#fff",
    // },
    versionCode: 105,
    permissions: [
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.INTERNET",
    ],
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-font",
    "expo-secure-store",
    [
      "expo-calendar",
      {
        calendarPermission:
          "The app needs to access your calendar if you want to add activities to it.",
      },
    ],
    [
      "expo-router",
      {
        origin: "https://feder.io",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/feder-base-app-logo.png",
        imageWidth: 65,
        resizeMode: "contain",
        backgroundColor: "#E3E3E3",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Feder uses your location to show nearby sports activities and events you can join. For exemple, we focus the event map on your neighbourhood",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
    [
      "expo-tracking-transparency",
      {
        userTrackingPermission:
          "This identifier will be used to analyze the app's usage and improve users experience.",
      },
    ],
    [
      "expo-notifications",
      {
        // icon: "./src/assets/sm_icon_notif_feder.png",
        sounds: [],
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/crashlytics",
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "15.1",
          image: "macos-ventura-13.6-xcode-16.1", // nécessaire pour que le deplymentTarget soit pris en compte
          useFrameworks: "static",
        },
        android: {
          enableProguardInReleaseBuilds: true,
          extraProguardRules: "-keep public class com.horcrux.svg.** {*;}",
        },
      },
    ],
    ["@react-native-google-signin/google-signin"],
    "expo-apple-authentication",
    [
      "expo-contacts",
      {
        contactsPermission:
          "Allow feder to access your contacts to identify your friends that are already here and have counted you in their team.",
      },
    ],
    "expo-localization",
  ],
  owner: "feder-bt-sport",
  jsEngine: "hermes",
  extra: {
    APP_VARIANT: process.env.EXPO_PUBLIC_APP_VARIANT,
    eas: { projectId: "0358bbf1-b1d2-421c-8160-3784167f6094" },
  },
});
