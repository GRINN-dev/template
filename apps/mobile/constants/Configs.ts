import Constants from "expo-constants";

const Config = {
  IS_PROD: Constants?.expoConfig?.extra?.env === "production",
  VERSION_CODE: 1,
};

export default Config;
