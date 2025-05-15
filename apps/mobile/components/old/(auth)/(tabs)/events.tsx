import { TouchableOpacity, View } from "react-native";
import { useQuery } from "@apollo/client";

import LogoNoResult from "@/assets/svg/logoNoResult.svg";
import Refresh from "@/assets/svg/refresh.svg";
import { EventNoResult } from "@/components/events/EventNoResult";
import EventsList from "@/components/events/EventsList";
import EventsMap from "@/components/events/EventsMap";
import useStore from "@/components/layout/useStore";
import { ThemedText } from "@/components/ThemedText";
import { colorSecondary500 } from "@/constants/ColorsFeder";
import { ResultOf } from "@/graphql";
import { EventsQuery } from "@/graphql/queries-content";
import useIsWidthLessThan400 from "@/utils/lessThan400";

export type EventsQueryProps = ResultOf<typeof EventsQuery>;

export default function AuthHomeScreen() {
  const isWidthLessThan400 = useIsWidthLessThan400();
  const {
    eventsView,
    filterSports: filterCategories,
    filterRegion,
    filterDate,
  } = useStore();
  const { data, loading, refetch, networkStatus } = useQuery(EventsQuery, {
    variables: {
      eventsFilter: {
        isAccessibleForUser: { equalTo: true },
        ...(filterCategories?.length > 0
          ? { sportId: { in: filterCategories } }
          : {}),
        startAt: {
          greaterThanOrEqualTo: filterDate?.min?.toISOString(),
          ...(filterDate?.max
            ? { lessThanOrEqualTo: filterDate?.max.toISOString() }
            : {}),
        },
        addresses: {
          latitude: {
            greaterThan:
              filterRegion?.latitude - filterRegion?.latitudeDelta / 2,
            lessThan: filterRegion?.latitude + filterRegion?.latitudeDelta / 2,
          },
          longitude: {
            greaterThan:
              filterRegion?.longitude - filterRegion?.longitudeDelta / 2,
            lessThan:
              filterRegion?.longitude + filterRegion?.longitudeDelta / 2,
          },
        },
      },
    },
  });

  if (eventsView === "map") {
    return (
      <View>
        <View
          className="items-center self-center rounded-full"
          style={{
            zIndex: 10,
            position: "absolute",
            backgroundColor: colorSecondary500,
            bottom: isWidthLessThan400 ? 110 : 150,
          }}
        >
          <TouchableOpacity
            className={`h-[40px] flex-row items-center justify-center gap-[10px] px-[16px]`}
            onPress={() => refetch()}
          >
            <Refresh width={16} height={16} />
            <ThemedText
              type="default"
              style={{
                color: "white",
              }}
            >
              Rafraichir
            </ThemedText>
          </TouchableOpacity>
        </View>
        <EventsMap events={data!} />
      </View>
    );
  } else if (eventsView === "list") {
    return data?.events?.nodes?.length !== 0 ? (
      <EventsList
        events={data!}
        refresh={refetch}
        networkStatus={networkStatus}
      />
    ) : (
      <EventNoResult
        refresh={refetch}
        networkStatus={networkStatus}
        title="Aucun résultat"
        descrition="Nous n’avons trouvé aucune activité, n’hésitez pas à vous lancer et
            à en créer une !"
        logo={<LogoNoResult />}
      />
    );
  }
}
