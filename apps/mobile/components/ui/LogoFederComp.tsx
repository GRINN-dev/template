import { View } from "react-native";

// import LogoFeder from "@/assets/svg/logo-feder.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";

export const LogoFederComp = () => {
  const isSmall = useIsWidthLessThan400();
  return (
    <View
      className={`w-full items-center ${isSmall ? "mt-[15px] h-12" : "mt-[43px] h-16"}`}
    >
      {/* <LogoFeder height={isSmall ? 48 : 64} /> */}
    </View>
  );
};
