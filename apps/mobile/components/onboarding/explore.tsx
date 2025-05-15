import { View } from "react-native";

import LogoFeder from "@/assets/svg/logo-feder.svg";
import Onboard_1 from "@/assets/svg/onboard_1.svg";
import ProgressionDots0 from "@/assets/svg/progressionDots0.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { OnboardingText } from "./onboarding-text";

export const OnboardingExplore = () => {
  const isSmall = useIsWidthLessThan400();
  return (
    <View className="grow flex-col items-center justify-between gap-10 px-6">
      <LogoFeder />
      <Onboard_1 height={isSmall ? 155 : 208} width={"100%"} />
      <OnboardingText
        title="Explorez et rejoignez des activités sportives autour de vous"
        content="Activités entre amis, événements locaux, compétitions...tout est là !"
      />
      <ProgressionDots0 />
    </View>
  );
};
