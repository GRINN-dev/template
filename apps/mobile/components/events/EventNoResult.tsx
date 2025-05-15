import { RefreshControl, ScrollView, View } from "react-native";
import {
  ApolloQueryResult,
  NetworkStatus,
  OperationVariables,
} from "@apollo/client";

import { colorSlate50, colorSurfaceBorderLight } from "@/constants/ColorsFeder";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const EventNoResult = ({
  title,
  logo,
  descrition,
  topBar = true,
  networkStatus,
  refresh,
}: {
  title: string;
  logo: React.ReactNode;
  descrition: string;
  topBar?: boolean;
  refresh: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<any>>;
  networkStatus: NetworkStatus;
}) => {
  const isWidthLessThan400 = useIsWidthLessThan400();
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: topBar ? 1 : 0,
        borderTopColor: colorSurfaceBorderLight,
        overflow: "hidden",
        backgroundColor: colorSlate50,
        paddingBottom: isWidthLessThan400 ? 80 : 96,
        paddingHorizontal: 40,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: isWidthLessThan400 ? 80 : 96,
          paddingHorizontal: 40,
        }}
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => refresh()}
            tintColor="#888"
          />
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: isWidthLessThan400 ? 16 : 32,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: isWidthLessThan400 ? 64 : 96,
              height: isWidthLessThan400 ? 64 : 96,
            }}
          >
            {logo}
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: isWidthLessThan400 ? 8 : 12,
            }}
          >
            <ThemedText
              type={
                isWidthLessThan400 ? "xs/brand/semibold" : "lg/brand/semibold"
              }
              style={{
                textAlign: "center",
              }}
            >
              {title}
            </ThemedText>
            <ThemedText
              type={isWidthLessThan400 ? "smallText" : "medium"}
              style={{ textAlign: "center" }}
            >
              {descrition}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};
