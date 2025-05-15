import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { usePathname, useRouter } from "expo-router";

import CrossIcon from "@/assets/svg/crossIcon.svg";
import FilterHome from "@/assets/svg/filterHome.svg";
import ListHome from "@/assets/svg/listHome.svg";
import MapHome from "@/assets/svg/mapHome.svg";
import MarkerSimple from "@/assets/svg/markerSimple.svg";
import { colorSlate50, colorTextSoft } from "@/constants/ColorsFeder";
import useIsWidthLessThan400 from "@/utils/lessThan400";
import GooglePlacesSearch from "../header/place-autocomplete";
import useStore from "../layout/useStore";
import { AvatarProfile } from "../profile/avatarProfile";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { AutoCompleteSearchBar } from "../ui/autoCompleteSearchBar";
import { BaseButton } from "../ui/base-button";
import { CustomFullModal } from "../ui/custom-full-modal";
import { IconButton } from "../ui/IconButton";
import { SportsFilterEvents } from "./SportFilterEvents";

const HeaderEvents = ({ data }: { data: any }) => {
  const {
    eventsView,
    setEventsView,
    setFilterRegion,
    setIsFilteringPositionOrSportOpen,
  } = useStore();
  const isSmallScreen = useIsWidthLessThan400();
  const [isFilteringSportOpen, setIsFilteringSportOpen] = useState(false);
  const [isFilteringPositionOpen, setIsFilteringPositionOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  if (!pathname.includes("events")) return null;

  const goToMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission d'accéder à la localisation refusée !");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Utiliser une valeur fixe pour le zoom
    const fixedZoom = 0.01;
    const offset = fixedZoom; //* 0.25; // Calcul de l'offset basé sur le zoom fixe
    const adjustedRegion = {
      latitude: latitude, // - offset, // Décalage pour compenser l'overlay
      longitude,
      latitudeDelta: fixedZoom,
      longitudeDelta: fixedZoom,
    };
    setFilterRegion(adjustedRegion);
    setIsFilteringPositionOrSportOpen(false);
    setIsFilteringPositionOpen(false);
  };

  return (
    <View
      className={`flex-row items-center gap-3 p-2`}
      style={{
        position: "absolute",
        left: 0,
        zIndex: 100,
      }}
    >
      {Platform.OS !== "android" ? (
        <CustomFullModal visible={isFilteringSportOpen}>
          <View
            style={{
              marginTop: 8,
              width: "100%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              className="mx-4 bg-white"
              style={{
                borderRadius: 16,
                backgroundColor: "white",
                position: "relative",
                height: 360,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colorSlate50,
                }}
              >
                <ThemedText type="defaultBold">Filtrer par activité</ThemedText>
                <IconButton
                  onPress={() => {
                    setIsFilteringPositionOrSportOpen(false);
                    setIsFilteringSportOpen(false);
                  }}
                  icon={<CrossIcon />}
                  shadow
                />
              </View>
              <SportsFilterEvents
                close={() => {
                  setIsFilteringPositionOrSportOpen(false);
                  setIsFilteringSportOpen(false);
                }}
              />
            </View>
          </View>
        </CustomFullModal>
      ) : (
        <Modal visible={isFilteringSportOpen} transparent={true}>
          <View
            style={{
              // width: Dimensions.get("window").width,
              // height: Dimensions.get("window").height + 200, // pr certains android où le fond s'arrête avant le bas
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              height: "100%",
            }}
          >
            <View
              style={{
                marginTop: insets.top + 8,
                width: "100%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View
                className="mx-4 bg-white"
                style={{
                  borderRadius: 16,
                  backgroundColor: "white",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colorSlate50,
                  }}
                >
                  <ThemedText type="defaultBold">
                    Filtrer par activité
                  </ThemedText>
                  <IconButton
                    onPress={() => setIsFilteringSportOpen(false)}
                    icon={<CrossIcon />}
                    shadow
                  />
                </View>
                <SportsFilterEvents
                  close={() => setIsFilteringSportOpen(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
      <CustomFullModal visible={isFilteringPositionOpen}>
        <View className="w-full flex-1 grow">
          <TouchableWithoutFeedback
            onPress={() => {
              setIsFilteringPositionOrSportOpen(false);
              setIsFilteringPositionOpen(false);
            }}
          >
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
                  <GooglePlacesSearch
                    onSelect={(details: GooglePlaceDetail | null) => {
                      if (!details?.geometry?.location) return;
                      const { lat: latitude, lng: longitude } =
                        details.geometry.location;
                      const fixedZoom = 0.01;
                      // const offset = fixedZoom * 0.25;

                      const adjustedRegion = {
                        latitude, //: latitude - offset,
                        longitude,
                        latitudeDelta: fixedZoom,
                        longitudeDelta: fixedZoom,
                      };
                      setFilterRegion(adjustedRegion);
                      setIsFilteringPositionOrSportOpen(false);
                      setIsFilteringPositionOpen(false);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsFilteringPositionOrSportOpen(false);
                      setIsFilteringPositionOpen(false);
                    }}
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
                        setIsFilteringPositionOrSportOpen(false);
                        setIsFilteringPositionOpen(false);
                      }}
                    />
                  </ThemedView>
                </ThemedView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </CustomFullModal>

      {!isFilteringSportOpen && !isFilteringPositionOpen ? (
        <View
          className="flex-row gap-4"
          style={{
            flex: 1,
            marginTop: isSmallScreen ? 17 : 53,
          }}
        >
          <View className="shrink flex-row gap-2">
            <IconButton
              onPress={() => {
                setIsFilteringPositionOrSportOpen(true);
                setIsFilteringSportOpen(!isFilteringSportOpen);
              }}
              icon={<FilterHome />}
              shadow
            />
            <AutoCompleteSearchBar
              onPress={() => {
                setIsFilteringPositionOrSportOpen(true);
                setIsFilteringPositionOpen(!isFilteringPositionOpen);
              }}
              onPressLocation={goToMyLocation}
            />
            <IconButton
              onPress={() =>
                setEventsView(eventsView === "map" ? "list" : "map")
              }
              icon={eventsView === "map" ? <ListHome /> : <MapHome />}
              shadow
            />
          </View>
          <View>
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
      ) : null}
    </View>
  );
};

export default HeaderEvents;
