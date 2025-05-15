import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { EventsQueryProps } from "@/components/old/(auth)/(tabs)/events";
import {
  colorPrimary300,
  colorPrimary500,
  colorSecondary500,
} from "@/constants/ColorsFeder";
import { getSportIcon } from "@/utils/GetSportIcon";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { formatDateWithMonth, hexToRgba, statusEnum } from "@/utils/utils";
import { CardChip } from "../squad/card-chip";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "./base-button";

export const CardActivity = ({
  event,
  invitation,
}: {
  event: NonNullable<EventsQueryProps["events"]>["nodes"][0];

  invitation?: "Organisateur" | "Participant";
}) => {
  const now = new Date();
  const isWidthLessThan400 = useIsWidthLessThan400();
  const router = useRouter();
  const getVisibilityType = (visibility: any) => {
    if (visibility === "ALLOPEN") return "publique";
    if (visibility === "OPENTEAM" || visibility === "PRIVATE") return "privee";
    return "publique";
  };

  const maxParticipants = event?.maxParticipants as number | null;
  const totalRegistered = event?.userEvents?.totalCount || 0;

  return (
    <ThemedView
      style={{
        borderRadius: 6,
        gap: 12,
        paddingBottom: isWidthLessThan400 ? 12 : 16,
        shadowColor: colorPrimary500,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
      }}
    >
      <View
        style={{
          position: "relative",
          borderBottomWidth: 1,
          borderBottomColor: hexToRgba(event?.sport?.color, 0.3),
          paddingHorizontal: 16,
          overflow: "hidden",
          paddingVertical: isWidthLessThan400 ? 8 : 12,
        }}
      >
        <View
          style={{
            height: 28,
            flexDirection: "row",
            gap: 4,
          }}
        >
          <ThemedText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              color: event?.sport?.color,
              flexGrow: 1,
              flexShrink: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            type="xl/brand/semibold"
          >
            {event?.sport?.name}
          </ThemedText>
        </View>
        {event?.sport && (
          <ThemedView
            style={{
              position: "absolute",
              right: 4,
              top: isWidthLessThan400 ? -10 : -6,
              opacity: 0.1,
              zIndex: -10,
            }}
          >
            {getSportIcon(event.sport.code, event.sport.color, 64, 64)}
          </ThemedView>
        )}
      </View>
      <View style={{ paddingHorizontal: 16, gap: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText
            type="xs/brand/semibold"
            style={{
              color: colorSecondary500,
            }}
          >
            {event?.startAt ? formatDateWithMonth(event.startAt) : ""}
          </ThemedText>
          {event?.getStatusOnEvent === "INV" && <CardChip type="invitation" />}
        </View>
        <ThemedText type="title" numberOfLines={2} ellipsizeMode="tail">
          {event?.title}
        </ThemedText>
        <ThemedText
          numberOfLines={3}
          ellipsizeMode="tail"
          style={{
            color: colorPrimary300,
          }}
          type="xs/brand/medium"
        >
          {event?.description}
        </ThemedText>
        <View className="flex-row items-center justify-between">
          <CardChip
            type={
              event?.startAt && new Date(event.startAt) > new Date()
                ? getVisibilityType(event?.visibility)
                : "terminee"
            }
          />
          {event?.maxParticipants !== null && (
            <CardChip
              type={
                event?.startAt && new Date(event.startAt) < new Date()
                  ? "participant"
                  : maxParticipants && totalRegistered >= maxParticipants
                    ? "complete"
                    : "places"
              }
              number={
                event?.startAt && new Date(event.startAt) < new Date()
                  ? `${totalRegistered}`
                  : maxParticipants && totalRegistered >= maxParticipants
                    ? ""
                    : `${totalRegistered}/${maxParticipants}`
              }
            />
          )}
        </View>
      </View>

      {invitation === "Organisateur" &&
      event?.startAt &&
      new Date(event?.startAt) > now ? (
        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <BaseButton
            title="Modifier"
            onPress={() => {
              router.push({
                pathname: "/(auth)/event-edition/event-edition",
                params: { statusBar: "form", eventId: event?.id },
              });
            }}
            type="solid"
          />
        </View>
      ) : null}
    </ThemedView>
  );
};
