import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";
import { useQuery } from "@apollo/client";

import LogoFeder from "@/assets/svg/logo-feder.svg";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { CurrentUserQuery } from "@/graphql/current-user";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { setStoreItemAsync } from "@/utils/secure-store";
import { EventsFilters } from "../events/EventsFilters";
import HeaderEvents from "../events/HeaderEvents";
import useStore from "../layout/useStore";
import { AvatarProfile } from "../profile/avatarProfile";

export const FederHeader = () => {
  const { eventsView } = useStore();
  const isWidthLessThan400 = useIsWidthLessThan400();
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useQuery(CurrentUserQuery);
  const insets = useSafeAreaInsets();

  return pathname?.includes("events") ? (
    <View
      style={
        eventsView === "list" && pathname?.includes("events")
          ? {
              backgroundColor: colorSlate50,
              paddingTop: isWidthLessThan400 ? Math.max(insets.top, 128) : 176,
            }
          : {}
      }
    >
      <HeaderEvents data={data} />
      <EventsFilters />
    </View>
  ) : (
    <View
      style={{
        paddingTop: insets?.top,
        backgroundColor: colorSlate50,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 8,
          backgroundColor: colorSlate50,
        }}
      >
        <View style={{ width: 99, height: 40 }}>
          <LogoFeder height={40} width={99} />
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/profile/profile")}
        >
          <AvatarProfile
            selectColor={data?.currentUser?.avatarColor ?? ""}
            firstName={data?.currentUser?.firstname ?? ""}
            lastName={data?.currentUser?.lastname ?? ""}
            size="sm"
            border={2}
            fontSize={20}
            avatarUrl={data?.currentUser?.avatarUrl ?? ""}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
