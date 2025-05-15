import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";

import { HeaderRouter } from "@/components/header/header-router";
import UpdateUser from "@/components/profile/update-form-user";
import { UpdatePassword } from "@/components/profile/UpdatePassword";
import { ThemedView } from "@/components/ThemedView";
import { SegmentSelector } from "@/components/ui/segment-selector-item";
import { CurrentUserQuery } from "@/graphql/current-user";

export interface SquadTabStatus {
  tab: "profile" | "settings";
}

export default function AuthProfileScreen() {
  const insets = useSafeAreaInsets();
  const { tab } = useLocalSearchParams();
  const [tabStatus, setTabStatus] = useState<SquadTabStatus["tab"]>("profile");
  const { data } = useQuery(CurrentUserQuery);
  //
  if (tab && tab !== tabStatus) {
    // Pour éviter une boucle infinie
    setTabStatus(tab as SquadTabStatus["tab"]);
  }

  let content;
  switch (tabStatus) {
    case "settings":
      content = (
        <ThemedView className="flex-1">
          <UpdatePassword />
        </ThemedView>
      );
      break;
    case "profile":
      content = (
        <ThemedView className="flex-1">
          <UpdateUser />
        </ThemedView>
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <>
        <HeaderRouter title="Mon espace" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
            {data?.currentUser?.firstname && data?.currentUser?.lastname ? (
              <ThemedView className="flex-1">
                <ThemedView className="mb-4">
                  <SegmentSelector
                    items={[
                      { title: "Profile", selected: tabStatus === "profile" },
                      {
                        title: "Paramètres",
                        selected: tabStatus === "settings",
                      },
                    ]}
                    onSelect={(index) =>
                      setTabStatus(index === 0 ? "profile" : "settings")
                    }
                    orientation="horizontal"
                    borderBottom
                  />
                </ThemedView>
                {content}
              </ThemedView>
            ) : (
              <ThemedView className="flex-1 pt-4">{content}</ThemedView>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    </ThemedView>
  );
}
