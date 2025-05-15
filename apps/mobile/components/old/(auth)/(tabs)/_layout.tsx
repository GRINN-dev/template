import React from "react";
import { Tabs } from "expo-router";

import { FederHeader } from "@/components/header/feder-header";
import { BottomTabBar } from "@/components/ui/BottomTabBar";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function AuthTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        header(props) {
          return <FederHeader />;
        },
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="squad/index" />
      <Tabs.Screen name="sessions/index" />
      <Tabs.Screen name="events" />
    </Tabs>
  );
}
