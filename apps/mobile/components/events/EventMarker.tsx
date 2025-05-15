import { TouchableOpacity, View } from "react-native";
import tinycolor from "tinycolor2";

import Clock3White from "@/assets/svg/clock3White.svg";
import Clock5White from "@/assets/svg/clock5White.svg";
import Clock10White from "@/assets/svg/clock10White.svg";
import ClockAjdWhite from "@/assets/svg/clockAjdWhite.svg";
import MarkerBaseBig from "@/assets/svg/markerBaseBig.svg";
import MarkerBaseSmall from "@/assets/svg/markerBaseSmall.svg";
import { EventsQueryProps } from "@/components/old/(auth)/(tabs)/events";
import { getSportIcon } from "@/utils/GetSportIcon";
import { calculDiffDays } from "@/utils/utils";

export const EventMarker = ({
  event,
}: {
  event: NonNullable<EventsQueryProps["events"]>["nodes"][0];
}) => {
  const diffDays = calculDiffDays(event?.startAt!, new Date());

  // Fonction pour retourner l'icône d'horloge en fonction de startAt
  const getClockIcon = (startAt?: string) => {
    if (!startAt) {
      return <ClockAjdWhite />;
    }
    if (diffDays === 0) {
      return <ClockAjdWhite />;
    } else if (diffDays <= 3) {
      return <Clock3White />;
    } else if (diffDays <= 5) {
      return <Clock5White />;
    } else if (diffDays <= 10) {
      return <Clock10White />;
    } else {
      return <Clock10White />;
    }
  };

  const baseColor = event?.sport?.color;
  const lightColor = tinycolor(baseColor).lighten(38).toString();
  const darkColor = tinycolor(baseColor).darken(16).toString();

  return diffDays <= 10 ? (
    <TouchableOpacity style={{ position: "relative" }}>
      <MarkerBaseBig
        style={{
          zIndex: 1,
        }}
        fill={lightColor}
      />
      <View
        style={{
          backgroundColor: darkColor,
          position: "absolute",
          top: 2,
          left: 0,
          zIndex: 10,
          height: 28,
          width: 48,
          borderRadius: 100,
        }}
      />
      <View
        style={{
          backgroundColor: baseColor,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 20,
          height: 28,
          width: 48,
          borderRadius: 100,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          zIndex: 30,
          height: 24,
          width: 24,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        {getSportIcon(event?.sport?.code!, baseColor)}
      </View>
      <View
        style={{
          position: "absolute",
          top: 2,
          right: 0,
          zIndex: 30,
          height: 24,
          width: 24,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {getClockIcon(event?.startAt)}
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity className="relative" style={{ height: 35, width: 28 }}>
      <MarkerBaseSmall
        style={{ zIndex: 1, position: "absolute", top: 1, left: 0 }}
        fill={lightColor}
      />
      <View
        style={{
          backgroundColor: darkColor,
          position: "absolute",
          top: 2,
          left: 0,
          zIndex: 10,
          height: 28,
          width: 28,
          borderRadius: 100,
        }}
      />
      <View
        style={{
          backgroundColor: baseColor,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 20,
          height: 28,
          width: 28,
          borderRadius: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "white",
          position: "absolute",
          top: 2,
          left: 2,
          zIndex: 30,
          height: 24,
          width: 24,
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {getSportIcon(event?.sport?.code!, baseColor)}
      </View>
    </TouchableOpacity>
  );
};
