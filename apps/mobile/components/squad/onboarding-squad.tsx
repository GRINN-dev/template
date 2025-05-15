import { Dispatch, SetStateAction, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useQuery } from "@apollo/client";

import SquadTabs from "@/assets/svg/squadTabs.svg";
import { SquadTabStatus } from "@/components/old/(auth)/(tabs)/squad";
import { CurrentUserQuery } from "@/graphql/current-user";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "../ui/base-button";
import { BottomSheet } from "../ui/Bottom-sheet";
import { NotificationForm } from "./onboarding/notification-form";
import { PhoneCodeForm } from "./onboarding/phone-code-form";
import { PhoneForm } from "./onboarding/phone-form";
import { RequestContactsAccessScreen } from "./onboarding/request-contacts-access-screen";
import { TeamFormOnboardingSquad } from "./onboarding/team-form";

export const OnboardingSquad = ({
  setTabStatus,
}: {
  setTabStatus: Dispatch<SetStateAction<SquadTabStatus["tab"]>>;
}) => {
  const { data: currentUserData } = useQuery(CurrentUserQuery);
  const [stepState, setStepState] = useState<
    "start" | "phone" | "code" | "contact" | "team" | "notifications"
  >("start");

  const checkUser = () => {
    if (!currentUserData?.currentUser) return;
    if (!currentUserData?.currentUser?.isPhoneCodeUsed) {
      setStepState("phone");
    } else if (
      !currentUserData?.currentUser?.preRegisteredContactsByInviterId
        ?.totalCount &&
      !currentUserData?.currentUser?.userContacts?.totalCount
    ) {
      setStepState("contact");
    } else if (!currentUserData?.currentUser?.notificationResponseDate) {
      setStepState("notifications");
    } else {
      setTabStatus("squad");
    }
  };

  const handleOnPressNext = () => {
    if (!currentUserData?.currentUser) return;
    if (stepState === "start") {
      checkUser();
    } else if (stepState === "phone") {
      setStepState("code");
    } else if (stepState === "code") {
      setStepState("contact");
    } else if (stepState === "contact") {
      setStepState("team");
    } else if (stepState === "team") {
      setStepState("notifications");
    } else if (stepState === "notifications") {
      setTabStatus("squad");
    }
  };

  return (
    <ThemedView className="h-full items-center px-4">
      <View className="mb-[80px] mt-[113px] items-center justify-center gap-8">
        <SquadTabs width={160} height={160} />
        <View className="gap-3">
          <ThemedText className="text-center align-middle text-lg font-bold italic">
            Invitez vos coéquipiers habituels dans votre équipe
          </ThemedText>
          <ThemedText className="text-center align-middle text-sm font-medium">
            Organisez simplement vos activités avec eux
          </ThemedText>
        </View>
      </View>
      <BaseButton
        title="Constituer mon équipe"
        type="solid"
        onPress={handleOnPressNext}
        disable={!currentUserData?.currentUser}
      />
      <BottomSheet
        onClose={() => setStepState("start")}
        openModal={stepState !== "start"}
        titleHeader="Constituer mon équipe"
      >
        <View className="flex-1">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            // keyboardVerticalOffset={200}
          >
            {stepState !== "team" ? (
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                }}
              >
                <ThemedView className="grow">
                  {stepState === "phone" ? (
                    <PhoneForm handleOnPressNext={handleOnPressNext} />
                  ) : stepState === "code" ? (
                    <PhoneCodeForm handleOnPressNext={handleOnPressNext} />
                  ) : stepState === "contact" ? (
                    <RequestContactsAccessScreen
                      handleOnPressNext={handleOnPressNext}
                    />
                  ) : (
                    <NotificationForm handleOnPressNext={handleOnPressNext} />
                  )}
                </ThemedView>
              </ScrollView>
            ) : (
              <TeamFormOnboardingSquad handleOnPressNext={handleOnPressNext} />
            )}
          </KeyboardAvoidingView>
        </View>
      </BottomSheet>
    </ThemedView>
  );
};
