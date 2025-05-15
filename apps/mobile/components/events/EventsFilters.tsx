import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";

import Clock3d from "@/assets/svg/clock3d.svg";
import Clock5d from "@/assets/svg/clock5d.svg";
import ClockAjd from "@/assets/svg/clockAdj.svg";
import {
  colorPrimary500,
  colorSecondary500,
  colorSlate50,
} from "@/constants/ColorsFeder";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import useStore from "../layout/useStore";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const EventsFilters = () => {
  const { setFilterDate } = useStore();
  const insets = useSafeAreaInsets();
  const [filteredButton, setFilteredButton] = useState<1 | 2 | 3 | null>();
  const isSmallScreen = useIsWidthLessThan400();
  const onPressButton = ({
    button,
    previousButton,
  }: {
    button: 1 | 2 | 3;
    previousButton?: 1 | 2 | 3 | null;
  }) => {
    if (button === previousButton) {
      //reset
      setFilteredButton(null);
      setFilterDate({
        min: new Date(),
        max: null,
      });
      return;
    } else {
      setFilteredButton(button);
      const date = new Date();
      const diffDays = [0, 3, 5];
      date.setDate(date.getDate() + diffDays[button - 1]);
      date.setHours(0, 0, 0, 0);
      setFilterDate({
        min: new Date(),
        max: date,
      });
    }
  };

  return (
    <ScrollView
      style={[styles.mapLayout, { top: isSmallScreen ? 73 : 109 }]}
      horizontal
      contentContainerStyle={{
        gap: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
      showsHorizontalScrollIndicator={false}
    >
      <FilterButton
        title={
          <ContentButton
            focused={filteredButton === 1}
            logo={
              <ClockAjd
                fill={
                  filteredButton === 1 ? colorSecondary500 : colorPrimary500
                }
              />
            }
            text="Aujourd'hui"
          />
        }
        focused={filteredButton === 1}
        transparentMode={filteredButton && filteredButton !== 1 ? true : false}
        onPress={() =>
          onPressButton({ button: 1, previousButton: filteredButton })
        }
      />
      <FilterButton
        title={
          <ContentButton
            focused={filteredButton === 2}
            logo={
              <Clock3d
                fill={
                  filteredButton === 2 ? colorSecondary500 : colorPrimary500
                }
              />
            }
            text="jours"
            daysTo
          />
        }
        focused={filteredButton === 2}
        transparentMode={filteredButton && filteredButton !== 2 ? true : false}
        onPress={() =>
          onPressButton({ button: 2, previousButton: filteredButton })
        }
      />
      <FilterButton
        title={
          <ContentButton
            focused={filteredButton === 3}
            logo={
              <Clock5d
                fill={
                  filteredButton === 3 ? colorSecondary500 : colorPrimary500
                }
              />
            }
            text="jours"
            daysTo
          />
        }
        focused={filteredButton === 3}
        transparentMode={filteredButton && filteredButton !== 3 ? true : false}
        onPress={() =>
          onPressButton({ button: 3, previousButton: filteredButton })
        }
      />
    </ScrollView>
  );
};
const ContentButton = ({
  logo,
  text,
  daysTo,
  focused,
}: {
  logo: React.ReactNode;
  text: string;
  daysTo?: boolean;
  focused?: boolean;
}) => {
  return (
    <View className="flex-row items-center justify-center gap-1">
      {daysTo && (
        <ThemedText
          type="defaultSemiBold"
          style={{
            color: focused ? colorSecondary500 : colorPrimary500,
          }}
        >
          - de
        </ThemedText>
      )}
      <View
        style={{
          height: 24,
          width: 24,
        }}
      >
        {logo}
      </View>
      <ThemedText
        type="defaultSemiBold"
        style={{
          color: focused ? colorSecondary500 : colorPrimary500,
        }}
      >
        {text}
      </ThemedText>
    </View>
  );
};

const FilterButton = ({
  onPress,
  disable,
  focused,
  title,
  transparentMode,
}: {
  onPress: () => void;
  disable?: boolean;
  focused?: boolean;
  title: React.ReactNode;
  transparentMode?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      className={`h-[35px] items-center justify-center rounded-full bg-white`}
      style={{
        borderWidth: focused ? 1 : 0,
        borderColor: focused ? colorSecondary500 : "#D1D5DB",
      }}
    >
      <View
        style={{
          paddingVertical: 6,
          paddingLeft: 8,
          paddingRight: 16,
        }}
      >
        {title}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapLayout: {
    position: "absolute",
    left: 0,
    zIndex: 50,
  },
});
