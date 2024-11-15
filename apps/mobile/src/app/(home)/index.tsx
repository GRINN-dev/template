import { Button, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import { client } from "@/components/apollo";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { deleteStoreItemAsync } from "@/utils/secure-store";

export default function HomeScreen() {
  const {
    data: currentUser,
    loading,
    error,
  } = useQuery(CurrentUser, {
    fetchPolicy: "network-only",
  });

  const delCacheAndGoLogin = async () => {
    await client.mutate({ mutation: Logout }).catch((error) => {
      console.error("Erreur de mutation:", error);
    });
    await deleteStoreItemAsync("access_token");
    await deleteStoreItemAsync("refresh_token");
    client.clearStore();
    router.replace("/(auth)/login");
  };

  if (loading) console.log("Chargement...");
  if (error) console.error("Erreur de requête:", error);
  console.log("currentUser", currentUser?.currentUser?.username);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Bienvenue {currentUser?.currentUser?.username} !
        </ThemedText>
        <HelloWave />
      </ThemedView>
      {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what&apos;s included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you&apos;re ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
       
      </ThemedView> */}
      <Button title="Login" onPress={() => router.push("/(auth)/login")} />
      <Button
        title="Register"
        onPress={() => router.push("/(auth)/register")}
      />
      <Button
        title="Onboarding"
        onPress={() => router.push("/(auth)/onboarding")}
      />
      <Button title="logout" onPress={delCacheAndGoLogin} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 260,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

const CurrentUser = graphql(`
  query currentUser {
    currentUser {
      id
      username
    }
  }
`);

const Logout = graphql(`
  mutation logout {
    logout {
      success
    }
  }
`);
