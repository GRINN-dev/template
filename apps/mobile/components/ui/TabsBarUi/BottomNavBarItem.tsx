import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const BottomNarBarItem = ({
  active,
  onPress,
  title,
  icon,
  index,
  isNotif,
}: {
  active?: boolean;
  onPress: () => void;
  title: string;
  icon: React.ReactNode;
  index: number;
  isNotif?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={{
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
      onPress={() => {
        onPress();
      }}
    >
      <View>
        {isNotif && (
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              position: "absolute",
              top: -4,
              right: -4,
              backgroundColor: "red",
            }}
          />
        )}
        {icon}
      </View>

      <Text
        style={[styles.text, active ? styles.activeText : styles.inactiveText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  activeText: {
    fontSize: 12,
    color: "#1f9A83",
    marginTop: 4,
  },
  inactiveText: {
    display: "none",
  },
});
