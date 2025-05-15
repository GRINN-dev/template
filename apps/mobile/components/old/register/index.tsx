import { useEffect } from "react";
import { Platform } from "react-native";
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";

import { LoginScreen } from "@/components/auth/LoginScreen";

const Register = () => {
  useEffect(() => {
    const requestTracking = async () => {
      if (Platform.OS === "ios") {
        const status = await getTrackingPermissionsAsync();
        if (status?.status === "undetermined") {
          await requestTrackingPermissionsAsync();
        }
      }
    };

    requestTracking();
  }, []);
  return <LoginScreen type="register" />;
};

export default Register;
