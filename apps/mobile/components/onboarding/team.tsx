import { View } from "react-native";

import LogoFeder from "@/assets/svg/logo-feder.svg";
import Onboard_3 from "@/assets/svg/onboard_3.svg";
import ProgressionDots2 from "@/assets/svg/progressionDots2.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ThemedView } from "../ThemedView";
import { OnboardingText } from "./onboarding-text";

export const OnboardingTeam = () => {
  const isSmall = useIsWidthLessThan400();
  return (
    <ThemedView className="grow flex-col items-center justify-between gap-10 px-6">
      <LogoFeder />
      <View className="flex-1">
        <Onboard_3 width={isSmall ? 162 : 282} height={"100%"} />
      </View>
      <OnboardingText
        title="Constituez votre équipe"
        content="Invitez votre partenaires habituels, organisez à vos activités avec eux, gardez le contact... Tout devient plus simple !"
      />
      <ProgressionDots2 />
    </ThemedView>
  );
};
