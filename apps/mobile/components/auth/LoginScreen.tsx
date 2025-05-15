import { useSafeAreaInsets } from "react-native-safe-area-context";

import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ThemedView } from "../ThemedView";
import { LogoFederComp } from "../ui/LogoFederComp";
import { LoginForm } from "./LoginForm";

export const LoginScreen = ({ type }: { type: "login" | "register" }) => {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView
      style={{
        paddingTop: insets.top,
      }}
      className="flex h-full flex-col space-y-5 px-6"
    >
      <LogoFederComp />
      <LoginForm type={type} />
    </ThemedView>
  );
};
