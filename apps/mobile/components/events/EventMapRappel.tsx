import React, { useRef } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Linking from "expo-linking";
import { useQuery } from "@apollo/client";

import {
  colorPrimary300,
  colorSky500,
  colorSlate50,
} from "@/constants/ColorsFeder";
import { AddressByIdQuery } from "@/graphql/addresses";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { BaseButton } from "../ui/base-button";
import { MarkerSimpleComponent } from "./MarkerSimple";

export const EventMapRappel = ({
  addressId,
  goToMap,
  goGoogleMap = false,
}: {
  addressId: string;
  goToMap?: () => void;
  goGoogleMap?: boolean;
}) => {
  const isWidthLessThan400 = useIsWidthLessThan400();

  const mapRef = useRef<MapView | null>(null);
  console.log("addressId", addressId);
  const { data } = useQuery(AddressByIdQuery, {
    variables: {
      addressId,
    },
    skip: !addressId,
  });
  const fixedZoom = 0.001;
  const region = {
    latitude: data?.address?.latitude ?? 0,
    longitude: data?.address?.longitude ?? 0,
    latitudeDelta: fixedZoom,
    longitudeDelta: fixedZoom,
  };

  const handlePress = () => {
    if (goGoogleMap) {
      if (data?.address) {
        const { latitude, longitude, formattedAddress } = data.address;
        const label = formattedAddress || "Destination";
        let url = "";
        if (Platform.OS === "ios") {
          // Utilisation d'Apple Maps sur iOS
          url = `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(label)}`;
        } else {
          // Utilisation de Google Maps sur Android
          url = `http://maps.google.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(label)}`;
        }
        Linking.openURL(url).catch((err) =>
          console.error("Erreur lors de l'ouverture de la carte", err),
        );
      } else {
        console.warn("Adresse non disponible");
      }
    } else {
      if (goToMap) {
        goToMap();
      }
    }
  };

  return (
    <ThemedView
      style={{
        gap: 12,
        borderRadius: 8,
        padding: 16,
        backgroundColor: colorSlate50,
      }}
    >
      <ThemedText
        style={{
          color: colorPrimary300,
        }}
        type={isWidthLessThan400 ? "xs/brand/semibold" : "sm/brand/semibold"}
      >
        Point de ralliement
      </ThemedText>
      {/* <ThemedText type="smallText">
        {data?.address?.formattedAddress}
      </ThemedText> */}
      <TouchableOpacity className="" onPress={handlePress}>
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: isWidthLessThan400 ? 128 : 168 }}
          provider={Platform.OS === "ios" ? undefined : PROVIDER_GOOGLE}
          initialRegion={region}
          region={region}
          scrollEnabled={false}
          zoomEnabled={false}
        />
        <View pointerEvents="none" style={styles.markerFixed}>
          <MarkerSimpleComponent />
        </View>
      </TouchableOpacity>
      {goGoogleMap ? (
        <ThemedText
          type="default"
          style={{
            color: colorSky500,
            textAlign: "center",
          }}
        >
          Touchez la carte pour voir la localisation exacte dans l’application
          de votre smartphone
        </ThemedText>
      ) : (
        <BaseButton title="Modifier" type="outlined" onPress={handlePress} />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});
