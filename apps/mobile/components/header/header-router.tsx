import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useQuery } from "@apollo/client";
import { AntDesign } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";

import CloseButton from "@/assets/svg/closeButton.svg";
import IconArrowBack from "@/assets/svg/iconArrowBack.svg";
import {
  colorSemanticOnDisabledLighter,
  colorSlate50,
} from "@/constants/ColorsFeder";
import { CurrentUserQuery } from "@/graphql/current-user";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { IconButton } from "../ui/IconButton";

interface HeaderRouterProps {
  title: string;
  push?: () => void;
  closeLogo?: boolean;
  actionClose?: () => void;
  backButton?: boolean;
  borderBottom?: boolean;
}

export const HeaderRouter: React.FC<HeaderRouterProps> = ({
  title,
  push,
  closeLogo,
  actionClose,
  backButton = true,
  borderBottom = true,
}) => {
  const router = useRouter();

  // Accède à l'historique de navigation
  const navigationState = useNavigationState((state) => state);
  // Vérifie si la route précédente était "/login"
  const previousRoute =
    navigationState?.routes?.[navigationState.index - 1]?.name;

  const { data } = useQuery(CurrentUserQuery);

  return (
    <ThemedView
      className="flex flex-row items-center justify-between px-4 py-3"
      style={{
        backgroundColor: colorSlate50,
        borderBottomWidth: borderBottom ? 1 : 0,
        borderColor: colorSemanticOnDisabledLighter,
      }}
    >
      <TouchableOpacity
        className="flex flex-row items-center gap-4"
        onPress={() => {
          if (
            data?.currentUser?.firstname &&
            data?.currentUser?.lastname &&
            data?.currentUser?.gender
          ) {
            push
              ? push()
              : previousRoute === "login/index" ||
                  previousRoute === "register/index"
                ? router.push("/(auth)/(tabs)/events")
                : router.back();
          }
        }}
      >
        {backButton ? (
          <View className="shadow-sm">
            <IconArrowBack width={40} height={40} />
          </View>
        ) : null}
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {title}
        </ThemedText>
      </TouchableOpacity>
      {closeLogo ? (
        <IconButton
          icon={<CloseButton />}
          onPress={() => (actionClose ? actionClose() : router.back())}
        />
      ) : null}
    </ThemedView>
  );
};
