import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Switch, View } from "react-native";
import { useQuery } from "@apollo/client";

import { colorPrimary500 } from "@/constants/ColorsFeder";
import { ResultOf } from "@/graphql";
import { GetAllCategoriesQuery } from "@/graphql/queries-content";
import { getSportIcon } from "@/utils/GetSportIcon";
import useStore from "../layout/useStore";
import { ThemedText } from "../ThemedText";
import { BaseButton } from "../ui/base-button";

export type GetCategoriesSportsResult = ResultOf<typeof GetAllCategoriesQuery>;

export const SportsFilterEvents = ({ close }: { close: () => void }) => {
  const { data } = useQuery(GetAllCategoriesQuery);
  const {
    filterSports: filterCategories,
    setFilterSports: setFilterCategories,
  } = useStore();

  // Créez un state local pour stocker temporairement les sélections
  const [tempFilterCategories, setTempFilterCategories] =
    useState(filterCategories);

  const onClick = () => {
    console.log("tempFilterCategories", tempFilterCategories);
    // Mettez à jour l'état global avec les sélections locales
    setFilterCategories(tempFilterCategories);
    console.log("Filtrage appliqué :", tempFilterCategories);
    close();
  };

  const flatListeSports = (data: GetCategoriesSportsResult) => {
    if (!data?.categories?.nodes) return [];

    return data.categories.nodes.flatMap((category) => category?.sports?.nodes);
  };

  return (
    <View className="relative" style={{ height: 360 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 24,
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 24,
          paddingBottom: 100, // espace pour ne pas cacher le contenu
        }}
      >
        {flatListeSports(data)?.map((category: any) => (
          <CategoryComponent
            key={category.code}
            category={category}
            tempFilterCategories={tempFilterCategories}
            setTempFilterCategories={setTempFilterCategories}
          />
        ))}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          backgroundColor: "white",
          borderBottomEndRadius: 16,
          borderBottomStartRadius: 16,
        }}
      >
        <BaseButton title="Filtrer" type="solid" onPress={onClick} />
      </View>
    </View>
  );
};

interface CategoryComponentProps {
  category: any;
  tempFilterCategories: any;
  setTempFilterCategories: (categories: any) => void;
}

const CategoryComponent = ({
  category,
  tempFilterCategories,
  setTempFilterCategories,
}: CategoryComponentProps) => {
  const toggleSwitch = () => {
    if (tempFilterCategories.includes(category.id)) {
      setTempFilterCategories(
        tempFilterCategories.filter((c: any) => c !== category.id),
      );
    } else {
      setTempFilterCategories([...tempFilterCategories, category.id]);
    }
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="grow flex-row items-center gap-[12px]">
        <View style={{ width: 24, height: 24 }}>
          {getSportIcon(category?.code, category?.color)}
        </View>
        <ThemedText type="defaultBold" style={{ color: category.color }}>
          {category.name}
        </ThemedText>
      </View>
      {Platform.OS === "android" ? (
        <View className="relative">
          <Pressable
            onPress={toggleSwitch}
            className="absolute left-0 top-0 z-10 h-8 w-12 bg-transparent"
          />
          <Switch
            value={tempFilterCategories.includes(category.id)}
            // onValueChange={toggleSwitch}
            trackColor={{ false: "#767577", true: colorPrimary500 }}
            thumbColor={
              tempFilterCategories.includes(category.id) ? "white" : "#f4f3f4"
            }
            ios_backgroundColor="#f4f3f4"
            style={{
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
            }}
          />
        </View>
      ) : (
        <Switch
          value={tempFilterCategories.includes(category.id)}
          onValueChange={toggleSwitch}
          trackColor={{ false: "#767577", true: colorPrimary500 }}
          thumbColor={
            tempFilterCategories.includes(category.id) ? "white" : "#f4f3f4"
          }
          ios_backgroundColor="#f4f3f4"
          style={{
            transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
          }}
        />
      )}
    </View>
  );
};
