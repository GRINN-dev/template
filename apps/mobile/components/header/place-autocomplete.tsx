import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";

import { GOOGLE_MAPS_API } from "@/utils/utils";

const GooglePlacesSearch = ({
  onSelect,
}: {
  onSelect: (details: GooglePlaceDetail | null) => void;
}) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);

  const fetchPredictions = async (text: string) => {
    setQuery(text);
    console.log("fetchPlaces", text);
    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_MAPS_API}&language=fr`,
        );
        const data = await response.json();
        if (data.predictions) {
          setPredictions(data.predictions.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching places: ", error);
      }
    } else {
      setPredictions([]);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      onSelect(data.result || null);
    } catch (error) {
      console.error("Erreur de récupération des détails :", error);
      onSelect(null);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Rechercher une adresse"
        value={query}
        onChangeText={fetchPredictions}
      />

      {predictions.length > 0 ? (
        <View style={styles.listView} className="rounded-lg">
          <FlatList
            data={predictions}
            keyExtractor={(item) => item?.place_id}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ddd",
                }}
              />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item?.place_id}
                style={styles.item}
                onPress={() => fetchPlaceDetails(item.place_id)}
              >
                <Text>{item?.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 100,
    paddingLeft: 30,
    backgroundColor: "white",
  },
  item: {
    padding: 10,
  },
  listView: {
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 100,
    width: "100%",
    height: 200,
    elevation: 10,
    position: "absolute",
    borderRadius: 16,
  },
});

export default GooglePlacesSearch;
