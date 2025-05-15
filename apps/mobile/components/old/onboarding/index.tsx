import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";

import { OnboardingCreate } from "@/components/onboarding/create";
import { OnboardingExplore } from "@/components/onboarding/explore";
import { OnboardingTeam } from "@/components/onboarding/team";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BaseButton } from "@/components/ui/base-button";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const router = useRouter();
  const posthog = usePostHog();
  return (
    <ThemedView
      className="bg-surface"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom ? insets.bottom : 4,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        height: "100%",
      }}
    >
      <ThemedView className="grow">
        {step === 0 ? (
          <OnboardingExplore />
        ) : step === 1 ? (
          <OnboardingCreate />
        ) : step === 2 ? (
          <OnboardingTeam />
        ) : null}
        <ThemedView className="mt-2 w-full gap-4 px-4">
          {step < 2 ? (
            <BaseButton
              onPress={() => setStep(step + 1)}
              type={"outlined"}
              title={"Passer"}
            />
          ) : null}
          <ThemedView className={`${step === 2 ? "mt-16" : ""}`}>
            <BaseButton
              onPress={() => {
                if (step < 2) {
                  setStep(step + 1);
                } else {
                  posthog?.capture("onboarding_completed", {
                    description: "Utilisateur a terminé l'onboarding",
                    // properties: ["temps_total", "slides_count"],
                    tags: ["Onboarding", "Slides introduction", "Moyenne"],
                    type: "event",
                  });
                  router.push("/register");
                }
              }}
              type={"solid"}
              title={"Suivant"}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
