import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { AppInitialiserNotifAndVersion } from "@/components/AppInitialiser";

import "react-native-reanimated";
import "react-native-get-random-values";
import "./../global.css";

import {
  Figtree_300Light,
  Figtree_300Light_Italic,
  Figtree_400Regular,
  Figtree_400Regular_Italic,
  Figtree_500Medium,
  Figtree_500Medium_Italic,
  Figtree_600SemiBold,
  Figtree_600SemiBold_Italic,
  Figtree_700Bold,
  Figtree_700Bold_Italic,
  Figtree_800ExtraBold,
  Figtree_800ExtraBold_Italic,
  Figtree_900Black,
  Figtree_900Black_Italic,
} from "@expo-google-fonts/figtree";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { ApolloWrapper } from "@/components/apollo";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter_400Regular,
    Figtree_300Light,
    Figtree_300Light_Italic,
    Figtree_400Regular,
    Figtree_400Regular_Italic,
    Figtree_500Medium,
    Figtree_500Medium_Italic,
    Figtree_600SemiBold,
    Figtree_600SemiBold_Italic,
    Figtree_700Bold,
    Figtree_700Bold_Italic,
    Figtree_800ExtraBold,
    Figtree_800ExtraBold_Italic,
    Figtree_900Black,
    Figtree_900Black_Italic,
  });

  GoogleSignin.configure({
    webClientId:
      "210904676040-6a3k5g43te5l0572hkgg44inpofv7tn6.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/user.gender.read"],
    googleServicePlistPath: "GoogleService-Info",
    // Config.IS_PROD
    // ? "GoogleService-Info"
    // :
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ApolloWrapper>
      <AppInitialiserNotifAndVersion>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="anonymous" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppInitialiserNotifAndVersion>
    </ApolloWrapper>
  );
}
