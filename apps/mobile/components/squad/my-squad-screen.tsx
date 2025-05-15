import { Dispatch, SetStateAction, useState } from "react";
import { FlatList, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";

import PlusIcon from "@/assets/svg/plusIcon.svg";
import { SquadTabStatus } from "@/components/old/(auth)/(tabs)/squad";
import { colorSlate50 } from "@/constants/ColorsFeder";
import { ResultOf } from "@/graphql";
import { UpdateUserMutation } from "@/graphql/mutations/user";
import { GetUserContactViews } from "@/graphql/queries-content";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "../ui/base-button";
import { BottomSheet } from "../ui/Bottom-sheet";
import { EmptyComponentList } from "../ui/empty-component-list";
import { SegmentSelector } from "../ui/segment-selector-item";
import { ContactCard, SimpleContactType } from "./contact-card";
import { ContactListFederAndPhone } from "./contact-list-feder-and-phone";

export type GetUserContactViewsResult = ResultOf<typeof GetUserContactViews>;

export const MySquadScreen = ({
  setTabStatus,
  tabStatus,
  suggestionsDot,
}: {
  setTabStatus: Dispatch<SetStateAction<SquadTabStatus["tab"]>>;
  tabStatus: SquadTabStatus["tab"];
  suggestionsDot: boolean;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isSmall = useIsWidthLessThan400();
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();

  const { data: userContactViews, fetchMore } = useQuery(GetUserContactViews, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "network-only",
  });

  const clickItem = (
    item: NonNullable<GetUserContactViewsResult["contactViews"]>["nodes"][0],
  ) => {
    if (item?.source === "user") {
      router.push({
        pathname: "/user/[userId]",
        params: { userId: item?.id as string },
      });
    } else if (item?.source === "pre_registered_contact") {
      router.push({
        pathname: "/pre-registered-user/[userId]",
        params: { userId: item?.id as string },
      });
    }
  };
  const [updateUser] = useMutation(UpdateUserMutation, {
    variables: {
      input: {
        id: userContactViews?.currentUserId ?? "",
        patch: {
          lastSuggestionActivity: new Date().toISOString(),
        },
      },
    },
    refetchQueries: ["GetNewSuggestionCount"],
  });

  return (
    <ThemedView
      className="flex-1"
      style={{
        backgroundColor: colorSlate50,
      }}
    >
      <View className="px-4">
        <SegmentSelector
          items={[
            { title: "Mon équipe", selected: tabStatus === "squad" },
            {
              title: "Suggestions",
              selected: tabStatus === "suggestions",
              hasNotification: suggestionsDot,
            },
          ]}
          onSelect={(index) => {
            setTabStatus(index === 0 ? "squad" : "suggestions");
            if (index === 1) {
              updateUser();
            }
          }}
          borderBottom
        />
      </View>
      <ThemedView className="p-4" style={{ backgroundColor: colorSlate50 }}>
        <BaseButton
          logo={<PlusIcon fill={"white"} />}
          title="Ajouter un coéquiper"
          onPress={() => {
            setModalOpen(true);
          }}
          type="solid"
        />
      </ThemedView>
      <View className="flex-1">
        {isScrolled && (
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              zIndex: 1,
            }}
          />
        )}
        <FlatList
          data={userContactViews?.contactViews?.nodes}
          onScroll={({ nativeEvent }) => {
            setIsScrolled(nativeEvent.contentOffset.y > 100);
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={<View style={{ height: 20 }} />}
          ItemSeparatorComponent={() => (
            <View className={isSmall ? "h-3" : "h-4"} />
          )}
          ListFooterComponent={<View style={{ height: isSmall ? 110 : 150 }} />}
          renderItem={({ item }) => (
            <ContactCard
              key={item!.id}
              contact={item as SimpleContactType}
              onPress={() => clickItem(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyComponentList
              title="Aucun membre à afficher"
              content="Votre équipe est vide, ajoutez des membres pour les retrouver ici"
            />
          }
          onEndReached={() => {
            console.log("onEndReached");
            if (!userContactViews?.contactViews?.nodes.length) return;
            fetchMore({
              variables: {
                offset: userContactViews?.contactViews?.nodes?.length ?? 0,
              },
              updateQuery: (
                previousQueryResult,
                options: {
                  fetchMoreResult: GetUserContactViewsResult;
                  variables: any;
                },
              ) => {
                if (!options?.fetchMoreResult?.contactViews?.nodes?.[0])
                  return previousQueryResult;
                return {
                  ...previousQueryResult,
                  contactViews: {
                    nodes: [
                      ...(previousQueryResult?.contactViews?.nodes ?? []),
                      ...options.fetchMoreResult.contactViews.nodes,
                    ],
                    totalCount: options.fetchMoreResult.contactViews.totalCount,
                  },
                };
              },
            });
          }}
        />
      </View>

      <BottomSheet
        openModal={modalOpen}
        titleHeader={"Constituer mon équipe"}
        onClose={() => setModalOpen(false)}
      >
        <ContactListFederAndPhone
          onPress={() => {
            setModalOpen(false);
          }}
        />
      </BottomSheet>
    </ThemedView>
  );
};
