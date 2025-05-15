import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Config from "@/constants/Config";

export default function AnonymousScreen() {
  const router = useRouter();
  const safeArea = useSafeAreaInsets();
  if (Config?.IS_DEV)
    return (
      <ThemedView
        style={[
          styles.stepContainer,
          { paddingTop: safeArea.top, paddingBottom: safeArea.bottom },
        ]}
      >
        <ThemedText type="subtitle">Bienvenue</ThemedText>
        <ThemedText>
          Bienvenue sur <ThemedText type="defaultSemiBold">feder</ThemedText>.
          Venez ici trouver des gens pour vous entraîner vers le sport.
        </ThemedText>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <ThemedText type="link">login</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <ThemedText type="link">register</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/onboarding")}>
          <ThemedText type="link">onboarding</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  return <ThemedView className="bg-primary-100 h-full" />;
}
const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
