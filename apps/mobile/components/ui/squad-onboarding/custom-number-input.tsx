import { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";

export const CustomNumberInput = ({
  value,
  onChange,
  editable,
  inputLength,
  onSubmit,
  backgroungdColor,
}: {
  value: string;
  onChange: (text: string) => void;
  editable?: boolean;
  inputLength: number;
  onSubmit: () => void;
  backgroungdColor?: string;
}) => {
  const inputRef = useRef<TextInput>(null);

  const onPressFakeInput = () => {
    inputRef.current?.focus();
  };

  return (
    <View
      className="h-12 items-center"
      style={{ backgroundColor: backgroungdColor }}
    >
      <TextInput
        ref={inputRef}
        value={value}
        editable={editable}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        maxLength={10}
        returnKeyType="go"
        returnKeyLabel="Valider"
        submitBehavior="submit"
        keyboardType="numeric"
        inputMode="numeric"
        style={styles.textInput}
      />
      <TouchableOpacity
        className="border-primary-light100 flex h-12 w-full flex-row items-center justify-between rounded-lg border-[1px] p-2"
        onPress={() => {
          console.log("onPressFakeInput");
          onPressFakeInput();
        }}
        disabled={!editable}
      >
        {Array.from({ length: inputLength }).map((_, i) => (
          <ThemedView
            className={`relative grow justify-center ${i < inputLength - 1 ? "border-r-2" : ""} border-primary-soft100`}
            key={i}
          >
            <Text
              className={`w-full min-w-3 text-center align-middle text-lg font-medium ${
                value?.length >= i ? "text-black-1" : "text-primary-soft100"
              }`}
              // style={[{ paddingTop: Platform.OS === "ios" ? 16 : 0 }]}
            >
              {value?.[i] ?? "."}
            </Text>
          </ThemedView>
        ))}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    opacity: 0,
    height: 1,
    width: 1,
  },
});
