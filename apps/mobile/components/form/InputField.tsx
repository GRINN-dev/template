import { useState } from "react";
import { TextInput, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export const InputField = ({
  title,
  control,
  errors,
  name,
  placeHolder,
  styleText,
  type,
  numberOfLines,
  widthFull,
  maxLength,
  items,
  onSubmitEditing,
  submitOnChange,
}: {
  title: string;
  control: Control<any>;
  errors: string;
  name: string;
  styleText?: string;
  placeHolder?: string;
  type: "password" | "text" | "number" | "select";
  numberOfLines?: number;
  maxLength?: number;
  widthFull?: boolean;
  items?: { label: string; value: string }[];
  onSubmitEditing?: () => void;
  submitOnChange?: boolean;
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(type === "password");
  const [textLength, setTextLength] = useState(0);
  const widthNumber = widthFull ? "w-full" : "w-20";
  if (type === "text" || type === "password") {
    return (
      <View className="gap-2">
        <ThemedText>{title}</ThemedText>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View
                className="relative rounded-lg border border-primary p-3"
                style={{
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  onBlur={onBlur}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setTextLength(text.length);
                    onChange(text);
                    submitOnChange ? onSubmitEditing?.() : null;
                  }}
                  value={value}
                  placeholder={placeHolder}
                  secureTextEntry={secureTextEntry}
                  multiline={!!numberOfLines}
                  numberOfLines={numberOfLines}
                  maxLength={maxLength}
                  style={{
                    height: numberOfLines ? 100 : 20,
                  }}
                  onSubmitEditing={onSubmitEditing}
                />
                {type === "password" && (
                  <Feather
                    name={secureTextEntry ? "eye-off" : "eye"}
                    size={24}
                    color="black"
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    style={{ position: "absolute", right: 10, top: 7 }}
                  />
                )}
              </View>
              {maxLength && (
                <ThemedText type="smallText" className="text-right">
                  {textLength}/{maxLength}
                </ThemedText>
              )}
            </>
          )}
        />
        {errors && <ThemedText type="error">{errors}</ThemedText>}
      </View>
    );
  } else if (type === "number") {
    return (
      <View className="gap-2">
        <ThemedText>{title}</ThemedText>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              keyboardType="numeric"
              placeholder={placeHolder ?? "0"}
              textAlign="right"
              onChangeText={(text) => onChange(text ? Number(text) : null)}
              value={value !== undefined && value !== null ? String(value) : ""}
              className={`h-10 ${widthNumber} rounded-lg border-2 border-primary bg-white p-2`}
            />
          )}
        />
      </View>
    );
  } else if (type === "select") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            value={value}
            onValueChange={(itemValue: any) => {
              onChange(itemValue);
            }}
            useNativeAndroidPickerStyle={false}
            doneText="Go"
            placeholder={
              {
                label: placeHolder,
                value: "",
                color: "#E3E3E3",
              } as any
            }
            Icon={() => {
              return (
                <View className="relative right-4 top-3">
                  <AntDesign name="caretdown" size={16} color="#545F66" />
                </View>
              );
            }}
            style={{
              inputIOS: {
                padding: 10,
                borderWidth: 1,
                borderColor: "#545F66",
                borderRadius: 10,
                color: "#545F66",
                fontSize: 16,
                backgroundColor: "white",
              },
              inputAndroid: {
                padding: 10,
                borderWidth: 1,
                borderColor: "#545F66",
                borderRadius: 10,
                color: "#545F66",
                fontSize: 16,
                backgroundColor: "white",
              },
            }}
            items={items ?? []}
          />
        )}
      />
    );
  }
};
