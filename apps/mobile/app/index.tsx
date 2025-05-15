import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLazyQuery } from "@apollo/client";
import { usePostHog } from "posthog-react-native";

// import FederIconSvg from "@/assets/svg/federIconSvg.svg";
import Config from "@/constants/Config";
import { CurrentUserQuery } from "@/graphql/current-user";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { getStoreItemAsync, setStoreItemAsync } from "@/utils/secure-store";

export default function HomeScreen() {
  const router = useRouter();
  const safeArea = useSafeAreaInsets();
  // const isSmall = useIsWidthLessThan400();
  const posthog = usePostHog();
  const [getCurrentUser] = useLazyQuery(CurrentUserQuery, {
    onCompleted: ({ currentUser }) => {
      if (currentUser?.id) {
        // router.push("/(auth)/(tabs)/events");
      } else {
        Config?.IS_DEV ? router.push("/anonymous") : router?.push("/login");
      }
    },
  });

  // on lauch : check if first launch to rout to onboarding
  React.useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const launchedBefore = await getStoreItemAsync("launched_before");
        if (!launchedBefore) {
          posthog?.capture("first_launch");
          await setStoreItemAsync("launched_before", "true");
          // router.push("/onboarding");
        } else {
          setTimeout(() => getCurrentUser(), 1000);
        }
      } catch (error) {
        console.error("Erreur AsyncStorage:", error);
      }
    };
    checkFirstLaunch();
  }, []);

  return (
    <View>
      <View
        style={{
          paddingTop: 300,
          paddingBottom: 200,
        }}
      >
        {/* <FederIconSvg /> */}
        <Text className="text-primary" style={styles.lgBrandSemiBold}>
          feder
        </Text>
      </View>
      {/* <View><Text>Développé par </Text></View> */}
    </View>
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
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  lgBrandSemiBold: {
    fontSize: 64,
    fontFamily: "Figtree_600SemiBold_Italic",
  },
});
