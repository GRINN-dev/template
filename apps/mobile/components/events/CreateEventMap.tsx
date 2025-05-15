import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";

import CrossIcon from "@/assets/svg/crossIcon.svg";
import MarkerSimple from "@/assets/svg/markerSimple.svg";
import { colorTextSoft } from "@/constants/ColorsFeder";
import { AddressByIdQuery, UpsertAddressMutation } from "@/graphql/addresses";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import { GOOGLE_MAPS_API } from "@/utils/utils";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { AutoCompleteSearchBar } from "../ui/autoCompleteSearchBar";
import { BaseArea } from "../ui/base-area";
import { BaseButton } from "../ui/base-button";
import { CardInfoEventEditonMap } from "../ui/CardInfoEventEditonMap";
import { CustomFullModal } from "../ui/custom-full-modal";
import { MarkerSimpleComponent } from "./MarkerSimple";

export const CreateEventsMap = ({
  onSuccess,
  addressId,
  info,
  setInfo,
}: {
  onSuccess: (addressId: any) => void;
  addressId?: string;
  info: boolean;
  setInfo: (value: boolean) => void;
}) => {
  const isSmallScreen = useIsWidthLessThan400();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: 48.8566, // Paris
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [addressDetails, setAddressDetails] =
    useState<GooglePlaceDetail | null>(null);
  const { data: addressData } = useQuery(AddressByIdQuery, {
    variables: {
      addressId: addressId as string,
    },
    skip: !addressId,
  });
  const [infoClosedManually, setInfoClosedManually] = useState<boolean>(false);
  // State pour stocker le résultat de la géocodification inversée via Google Maps
  const [upsertAddress] = useMutation(UpsertAddressMutation);
  const router = useRouter();
  const submitAddress = () => {
    const addressComponents = addressDetails?.address_components || [];
    const componentMap: any = {
      subPremise: "",
      premise: "",
      street_number: "",
      route: "",
      country: "",
      postal_code: "",
      locality: "",
      administrative_area_level_2: "",
      administrative_area_level_1: "",
    };

    for (const component of addressComponents) {
      const componentType = component.types[0];
      if (componentMap.hasOwnProperty(componentType)) {
        componentMap[componentType] = component.long_name;
      }
    }

    const formattedAddress =
      `${componentMap.subPremise} ${componentMap.premise} ${componentMap.street_number} ${componentMap.route}`.trim();
    upsertAddress({
      variables: {
        input: {
          city: componentMap.locality,
          district: componentMap.administrative_area_level_2,
          region: componentMap.administrative_area_level_1,
          country: componentMap.country,
          firstLine: formattedAddress,
          latitude: addressDetails?.geometry.location.lat,
          longitude: addressDetails?.geometry.location.lng,
          zipCode: componentMap.postal_code,
          districtZipCode: componentMap.postal_code.slice(0, 2),
          pGooglePlaceId: addressDetails?.place_id,
        },
      },
    })
      .then((res) => {
        console.log("Adresse sauvegardée avec succès !");
        console.log(res.data?.upsertAddress);
        const addressId = res.data?.upsertAddress?.result?.id;
        onSuccess(addressId);
      })
      .catch((error) => {
        console.error("Erreur lors de la sauvegarde de l'adresse:", error);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors du choix de ralliement.",
        );
      });
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // alert("Permission d'accéder à la localisation refusée !");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const fixedZoom = 0.01;
      const adjustedRegion = {
        latitude: addressData?.address?.latitude ?? latitude,
        longitude: addressData?.address?.longitude ?? longitude,
        latitudeDelta: fixedZoom,
        longitudeDelta: fixedZoom,
      };
      setRegion(adjustedRegion);
      fetchReverseGeocode(adjustedRegion);
      mapRef?.current?.animateToRegion(adjustedRegion, 1000);
    };
    fetchUserLocation();
  }, []);

  // Utilisation de l'API Google Maps pour la géocodification inversée.
  // On utilise les coordonnées "réelles" du marker (en ajoutant l'offset)
  const fetchReverseGeocode = async (newRegion: any) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newRegion.latitude},${newRegion.longitude}&key=${GOOGLE_MAPS_API}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK" && data.results && data.results.length > 0) {
        setAddressDetails(data.results[0]);
        console.log("Adresse reverse geocode (Google Maps):", data.results[0]);
      } else {
        console.error("Erreur de géocodification Google Maps:", data.status);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la géocodification:",
        error,
      );
    }
  };

  const goToMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission d'accéder à la localisation refusée !");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const fixedZoom = 0.01;
    const adjustedRegion = {
      latitude: latitude,
      longitude,
      latitudeDelta: fixedZoom,
      longitudeDelta: fixedZoom,
    };

    mapRef?.current?.animateToRegion(adjustedRegion, 1000);
  };

  const hideInfoWithDelay = () => {
    setTimeout(() => {
      setInfo(false);
      setInfoClosedManually(true);
    }, 1000);
  };

  const handleCloseInfo = () => {
    setInfo(false);
    setInfoClosedManually(true);
  };

  const onRegionChangeComplete = (newRegion: any) => {
    if (
      Math.abs(newRegion.latitude - region.latitude) > 0.001 ||
      Math.abs(newRegion.longitude - region.longitude) > 0.001
    ) {
      region;
      fetchReverseGeocode(newRegion);
      setRegion(newRegion);
      hideInfoWithDelay();
    }
  };

  return (
    <ThemedView className="flex-1">
      <CustomFullModal visible={isModalOpen}>
        <View className="w-full flex-1 grow">
          <TouchableWithoutFeedback onPress={() => setIsModalOpen(false)}>
            <View
              style={{
                flexGrow: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                position: "relative",
              }}
            >
              <View
                style={{
                  width: "100%",
                  left: 0,
                  padding: 8,
                }}
              >
                <View
                  style={{
                    zIndex: 100,
                    height: 40,
                    borderRadius: 100,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      top: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      left: 5,
                      borderRadius: 100,
                      zIndex: 100,
                    }}
                  >
                    <MarkerSimple />
                  </View>
                  <GooglePlacesAutocomplete
                    placeholder="Rechercher une adresse"
                    fetchDetails={true}
                    onFail={(error) => console.error(error)}
                    onPress={(
                      data: GooglePlaceData,
                      details: GooglePlaceDetail | null,
                    ) => {
                      if (!details?.geometry?.location) return;
                      const { lat: latitude, lng: longitude } =
                        details.geometry.location;
                      const fixedZoom = 0.01;

                      const adjustedRegion = {
                        latitude: latitude,
                        longitude,
                        latitudeDelta: fixedZoom,
                        longitudeDelta: fixedZoom,
                      };
                      setIsModalOpen(false);
                      mapRef?.current?.animateToRegion(adjustedRegion, 1000);
                    }}
                    textInputProps={{
                      onChangeText: (text) => {
                        if (!infoClosedManually) {
                          setInfo(text ? false : true);
                        }
                      },
                    }}
                    query={{
                      key: GOOGLE_MAPS_API,
                      language: "fr",
                    }}
                    enablePoweredByContainer={false}
                    styles={{
                      container: {},
                      textInputContainer: {},
                      textInput: styles.textInput,
                      listView: styles.listView,
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => setIsModalOpen(false)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: 40,
                      width: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: colorTextSoft,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <CrossIcon />
                  </TouchableOpacity>
                </View>
                <ThemedView>
                  <ThemedView
                    className="absolute top-4 w-full items-center gap-6 rounded-2xl bg-white px-4 pb-4 pt-8"
                    style={{ zIndex: 90 }}
                  >
                    <ThemedText>Renseignez une adresse</ThemedText>
                    <ThemedView className="flex-row items-center gap-4">
                      <ThemedView className="border-primary-100 grow border-[1px]" />
                      <ThemedText className="w-[51px] text-center">
                        OU
                      </ThemedText>
                      <ThemedView className="border-primary-100 grow border-[1px]" />
                    </ThemedView>
                    <BaseButton
                      title="Utiliser ma position"
                      type="solid"
                      onPress={() => {
                        goToMyLocation();
                        setIsModalOpen(false);
                      }}
                    />
                  </ThemedView>
                </ThemedView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </CustomFullModal>
      <View
        className={`flex-row items-center gap-3 p-2`}
        style={{
          position: "absolute",
          left: 0,
          top: isSmallScreen ? 17 : 53,
          zIndex: 10,
        }} // z-90 pas supporté par RN
      >
        <AutoCompleteSearchBar
          onPress={() => {
            setIsModalOpen(true);
          }}
          onPressLocation={goToMyLocation}
        />
      </View>
      {/* <Modal visible={isModalOpen} transparent>
        <TouchableWithoutFeedback onPress={() => setIsModalOpen(false)}>
          <ThemedView
            style={{
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              position: "relative",
            }}
          >
            <View
              style={{
                position: "absolute",
                width: "100%",
                top: isSmallScreen ? 17 : 53,
                left: 0,
                padding: 8,
              }}
            >
              <View
                style={{
                  zIndex: 100,
                  height: 40,
                  borderRadius: 100,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    top: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    left: 5,
                    borderRadius: 100,
                    zIndex: 100,
                  }}
                >
                  <MarkerSimple />
                </View>
                <GooglePlacesAutocomplete
                  placeholder="Rechercher une adresse"
                  fetchDetails={true}
                  onFail={(error) => console.error(error)}
                  onPress={(
                    data: GooglePlaceData,
                    details: GooglePlaceDetail | null,
                  ) => {
                    if (!details?.geometry?.location) return;
                    const { lat: latitude, lng: longitude } =
                      details.geometry.location;
                    const fixedZoom = 0.01;

                    const adjustedRegion = {
                      latitude: latitude,
                      longitude,
                      latitudeDelta: fixedZoom,
                      longitudeDelta: fixedZoom,
                    };
                    setIsModalOpen(false);
                    mapRef?.current?.animateToRegion(adjustedRegion, 1000);
                  }}
                  textInputProps={{
                    onChangeText: (text) => {
                      if (!infoClosedManually) {
                        setInfo(text ? false : true);
                      }
                    },
                  }}
                  query={{
                    key: GOOGLE_MAPS_API,
                    language: "fr",
                  }}
                  enablePoweredByContainer={false}
                  styles={{
                    container: {},
                    textInputContainer: {},
                    textInput: styles.textInput,
                    listView: styles.listView,
                  }}
                />

                <TouchableOpacity
                  onPress={() => setIsModalOpen(false)}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: colorTextSoft,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <CrossIcon />
                </TouchableOpacity>
              </View>
              <ThemedView>
                <ThemedView
                  className="absolute top-4 w-full items-center gap-6 rounded-2xl bg-white px-4 pb-4 pt-8"
                  style={{ zIndex: 90 }}
                >
                  <ThemedText>Renseignez une adresse</ThemedText>
                  <ThemedView className="flex-row items-center gap-4">
                    <ThemedView className="border-primary-100 grow border-[1px]" />
                    <ThemedText className="w-[51px] text-center">OU</ThemedText>
                    <ThemedView className="border-primary-100 grow border-[1px]" />
                  </ThemedView>
                  <BaseButton
                    title="Utiliser ma position"
                    type="solid"
                    onPress={() => {
                      goToMyLocation();
                      setIsModalOpen(false);
                    }}
                  />
                </ThemedView>
              </ThemedView>
            </View>
          </ThemedView>
        </TouchableWithoutFeedback>
      </Modal> */}
      {info && <CardInfoEventEditonMap handleCloseInfo={handleCloseInfo} />}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "ios" ? undefined : PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        region={region}
      />

      <View pointerEvents="none" style={styles.markerFixed}>
        <MarkerSimpleComponent />
      </View>
      <ThemedView className="items-center justify-center px-4">
        <BaseArea bottom="bottom-24">
          <BaseButton
            onPress={() => {
              router.back();
            }}
            title="Annuler"
            type="outlined"
          />
        </BaseArea>
        <BaseArea>
          <BaseButton
            onPress={() => {
              submitAddress();
            }}
            title="Choisir ce point de ralliement"
            type="solid"
          />
        </BaseArea>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    width: 28,
    marginLeft: -14,
    marginTop: -28,
  },
  textInput: {
    color: "#5d5d5d",
    backgroundColor: "white",
    borderRadius: 100,
    height: 40,
    paddingLeft: 30,
  },
  listView: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 100,
    width: "100%",
    elevation: 10,
    borderRadius: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
