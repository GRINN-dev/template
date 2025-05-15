import { Modal, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colorPrimary500 } from "@/constants/ColorsFeder";
import { ThemedView } from "../ThemedView";
import { BottomSheetHeader } from "./BottomSheetHeader";

export const BottomSheet = ({
  children,
  classNameStyle,
  openModal,
  titleHeader,
  onClose,
  color = "#545F66",
  border,
  showInfo = false,
  showClose = true,
  textCenter = false,
  sport,
  backgroundColor,
}: {
  children: React.ReactNode;
  classNameStyle?: string;
  openModal: boolean;
  titleHeader: string;
  onClose: () => void;
  color?: string;
  border?: boolean;
  showInfo?: boolean;
  showClose?: boolean;
  textCenter?: boolean;
  sport?: string;
  backgroundColor?: string;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={openModal} animationType="slide" transparent={true}>
      <View
        style={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: backgroundColor
            ? backgroundColor
            : "rgba(255, 255, 255, 0.7)",
          paddingTop: insets.top,
        }}
      >
        <View
          className="w-full flex-1 rounded-t-2xl"
          style={{
            shadowColor:
              Platform.OS === "ios"
                ? "rgba(0, 0, 0, 0.25)"
                : "rgba(0, 0, 0, 1)",
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.9,
            shadowRadius: 3,
            elevation: 10,
          }}
        >
          <BottomSheetHeader
            title={titleHeader}
            color={color}
            border={border}
            showInfo={showInfo}
            showClose={showClose}
            textCenter={textCenter}
            sport={sport}
            onClose={() => onClose()}
          />
          {children}
        </View>
      </View>
    </Modal>
  );
};
