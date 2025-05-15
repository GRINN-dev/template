import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";

import { MySquadScreen } from "@/components/squad/my-squad-screen";
import { OnboardingSquad } from "@/components/squad/onboarding-squad";
import { Suggestions } from "@/components/squad/suggestions";
import { ThemedView } from "@/components/ThemedView";
import {
  CurrentUserQuery,
  GetNewSuggestionCount,
} from "@/graphql/current-user";

export interface SquadTabStatus {
  tab: "onboarding" | "squad" | "suggestions";
}

export default function MySquad() {
  const { tab } = useLocalSearchParams();
  const [tabStatus, setTabStatus] = useState<SquadTabStatus["tab"]>("squad");

  const { data, loading } = useQuery(CurrentUserQuery);
  const { data: getNewSuggestionsCount } = useQuery(GetNewSuggestionCount);

  if (loading) {
    return (
      <ThemedView className="flex h-full items-center justify-center bg-white pb-40">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  } else if (
    !data?.currentUser?.notificationResponseDate &&
    tabStatus !== "onboarding"
  ) {
    setTabStatus("onboarding");
  } else if (tab && tab !== tabStatus) {
    setTabStatus(tab as SquadTabStatus["tab"]);
  }

  switch (tabStatus) {
    case "onboarding":
      return (
        <ThemedView className="!bg-surface h-full">
          <OnboardingSquad setTabStatus={setTabStatus} />
        </ThemedView>
      );
    case "squad":
      return (
        <ThemedView className="!bg-surface h-full">
          <MySquadScreen
            tabStatus={tabStatus}
            setTabStatus={setTabStatus}
            suggestionsDot={!!getNewSuggestionsCount?.getNewSuggestions}
          />
        </ThemedView>
      );
    case "suggestions":
      return (
        <ThemedView className="!bg-surface h-full px-4">
          <Suggestions
            tabStatus={tabStatus}
            setTabStatus={setTabStatus}
            suggestionsDot={!!getNewSuggestionsCount?.getNewSuggestions}
          />
        </ThemedView>
      );
    default:
      <ThemedView className="!bg-surface h-full px-4">
        <MySquadScreen
          tabStatus={tabStatus}
          setTabStatus={setTabStatus}
          suggestionsDot={!!getNewSuggestionsCount?.getNewSuggestions}
        />
      </ThemedView>;
  }
}
