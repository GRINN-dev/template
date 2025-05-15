import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";

import CalendarTabs from "@/assets/svg/calendarTabs.svg";
import SquadTabs from "@/assets/svg/squadTabs.svg";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { BottomNavBarCirclularButton } from "./TabsBarUi/BottomNavBarCirclularButton";
import { BottomNarBarItem } from "./TabsBarUi/BottomNavBarItem";

export function BottomTabBar({ state, navigation }: any) {
  const isWidthLessThan400 = useIsWidthLessThan400();

  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = React.useState(1);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handlePress = (index: number, route: string) => {
    setActiveIndex(index);
    navigation.navigate(route);
  };
  return (
    <View
      className="relative"
      style={{
        backgroundColor: "blue",
        bottom: Platform.OS === "android" && !isWidthLessThan400 ? 16 : 0,
      }}
    >
      <View
        className="absolute bottom-0 rounded-full bg-white"
        style={[
          styles.container,
          styles.backContainer,
          {
            bottom: isWidthLessThan400 ? insets.bottom + 16 : insets.bottom,
            paddingHorizontal: isWidthLessThan400 ? 40 : 48,
          },
        ]}
      >
        <View
          style={{
            position: "absolute",
            bottom: pathname === "/events" ? 12 : 0,
            left: "50%",
            right: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            className="items-center justify-center rounded-full bg-white"
            style={{
              height: isWidthLessThan400 ? 72 : 96,
              width: isWidthLessThan400 ? 72 : 96,
              shadowColor:
                Platform.OS === "ios"
                  ? "rgba(0, 0, 0, 0.15)"
                  : "rgba(0, 0, 0, 1)",
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 8,
              elevation: 8,
            }}
          />
        </View>
      </View>
      <View
        style={[
          styles.container,
          styles.frontContainer,
          {
            bottom: isWidthLessThan400 ? insets.bottom + 16 : insets.bottom,
            paddingHorizontal: isWidthLessThan400 ? 40 : 48,
          },
        ]}
      >
        <BottomNarBarItem
          onPress={() => {
            handlePress(0, "squad/index");
          }}
          title="Équipe"
          icon={
            <SquadTabs
              fill={activeIndex === 0 ? "#1f9A83" : "#9CA3AF"}
              width={32}
              height={32}
            />
          }
          active={pathname === "/squad"}
          index={0}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: pathname === "/events" ? 12 : 0,
            left: "50%",
            right: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            if (pathname === "/events") {
              router.push("/(auth)/event-edition/event-edition");
            } else {
              handlePress(1, "events");
            }
          }}
        >
          <BottomNavBarCirclularButton isActive={pathname === "/events"} />
        </TouchableOpacity>

        <BottomNarBarItem
          onPress={() => {
            handlePress(2, "sessions/index");
          }}
          title="Activités"
          icon={
            <CalendarTabs
              fill={activeIndex === 2 ? "#1f9A83" : "#9CA3AF"}
              width={32}
              height={32}
            />
          }
          active={pathname === "/sessions"}
          index={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    borderRadius: 100,
    height: 64,
    left: 16,
    right: 16,
    paddingVertical: 6,
    width: "auto",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backContainer: {
    zIndex: -10,
  },
  frontContainer: {
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 8,
    elevation: 8,
    zIndex: 10,
  },
});
