import MapView from "react-native-maps";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { create } from "zustand";

import { FranceRegion } from "@/utils/utils";

interface LayoutState {
  eventsView: "map" | "list" | "";
  setEventsView: (view: "map" | "list" | "") => void;
  filterSports: string[];
  setFilterSports: (categories: string[]) => void;
  filterRegion: {
    latitude: Float; // Paris
    longitude: Float;
    latitudeDelta: Float;
    longitudeDelta: Float;
  };
  setFilterRegion: (region: {
    latitude: Float; // Paris
    longitude: Float;
    latitudeDelta: Float;
    longitudeDelta: Float;
  }) => void;
  filterDate: { min: Date; max: Date | null };
  setFilterDate: (filter: { min: Date; max: Date | null }) => void;
  isFilteringPositionOrSportOpen: boolean;
  setIsFilteringPositionOrSportOpen: (isOpen: boolean) => void;
  reset: () => void;
}

// Define the store
const useStore = create<LayoutState>((set) => ({
  eventsView: "map",
  setEventsView: (view: "map" | "list" | "") => set({ eventsView: view }),
  filterSports: [],
  setFilterSports: (sports: string[]) => set({ filterSports: sports }),
  filterRegion: FranceRegion,
  setFilterRegion: (region) => set({ filterRegion: region }),
  filterDate: { min: new Date(), max: null },
  setFilterDate: (date) => set({ filterDate: date }),
  isFilteringPositionOrSportOpen: false,
  setIsFilteringPositionOrSportOpen: (isOpen) =>
    set({ isFilteringPositionOrSportOpen: isOpen }),
  reset: () =>
    set({
      eventsView: "map",
      filterSports: [],
      filterRegion: FranceRegion,
      filterDate: { min: new Date(), max: null },
      isFilteringPositionOrSportOpen: false,
    }),
}));

export default useStore;
