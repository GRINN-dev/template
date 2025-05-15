import { View } from "react-native";

import LogoFeder from "@/assets/svg/logo-feder.svg";
import Onboard_2 from "@/assets/svg/onboard_2.svg";
import ProgressionDots1 from "@/assets/svg/ProgressionDots1.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { OnboardingText } from "./onboarding-text";

export const OnboardingCreate = () => {
  const isSmall = useIsWidthLessThan400();
  return (
    <View className="grow flex-col items-center justify-between gap-10 px-6">
      <LogoFeder />
      <Onboard_2 height={isSmall ? 165 : 223} width={"100%"} />
      <OnboardingText
        title="Créez et proposez vos activités sportives en quelques clics"
        content="Avec votre équipe ou toute la communauté FEDER...vous décidez !"
      />
      <ProgressionDots1 />
    </View>
  );
};
