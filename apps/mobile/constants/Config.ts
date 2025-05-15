import Constants from "expo-constants";

const Config = {
  IS_PROD: Constants?.expoConfig?.extra?.APP_VARIANT === "production",
  IS_DEV: Constants?.expoConfig?.extra?.APP_VARIANT === "development",
  VERSION_CODE: 1,
};

export default Config;
