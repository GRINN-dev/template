import { TouchableOpacity, View } from "react-native";
import tinycolor from "tinycolor2";

export const IconButton = ({
  onPress,
  icon,
  backgroundColor = "white",
  shadow,
  color,
  border,
}: {
  icon: React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
  shadow?: boolean;
  color?: string;
  border?: boolean;
}) => {
  const baseColor = color;
  const lightColor = tinycolor(baseColor).lighten(38).toString();
  const darkColor = tinycolor(baseColor).darken(10).toString();
  return (
    <View
      className="h-10 w-10 items-center justify-center"
      style={
        shadow && {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }
      }
    >
      <TouchableOpacity
        className="h-full w-full items-center justify-center rounded-full"
        style={{
          backgroundColor,
          borderWidth: border ? 1 : 0,
          borderColor: lightColor,
        }}
        onPress={() => {
          onPress();
        }}
      >
        {icon}
      </TouchableOpacity>
    </View>
  );
};
