import { Animated, TouchableOpacity, View } from "react-native";

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  position: any;
  tabBarOpacity?: number;
  customStyle?: any;
  notificationDot?: boolean;
}

const TabBar = ({
  state,
  descriptors,
  navigation,
  position,
  customStyle,
  notificationDot,
  // tabBarOpacity,
}: TabBarProps) => {
  /* const isContactsFocused =
    state.index ===
    state.routes.findIndex((route: any) => route.name === "contacts"); */

  return (
    <View
      style={[
        customStyle,
        {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 40,
          backgroundColor: "white",
        },
      ]}
    >
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_: any, i: any) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i: any) => (i === index ? 1 : 1)),
        });

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View
              className={isFocused ? "relative border-b-2 pb-1" : "relative"}
            >
              <Animated.Text
                style={{ opacity, fontWeight: isFocused ? "bold" : "normal" }}
              >
                {label}
              </Animated.Text>
              {notificationDot && (
                <View
                  className="absolute left-16 ml-2 h-3 w-3 items-center justify-center rounded-full bg-red-500"
                  style={{ zIndex: 1 }}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default TabBar;
