import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";

const Step3PhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [show, setShow] = useState(false);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
  };

  return (
    <View>
      <Text>Numéro de téléphone</Text>
      <View className="mt-6 flex flex-row items-center justify-center">
        <View className="flex flex-row items-center">
          <TouchableOpacity
            onPress={() => setShow(true)}
            className="flex h-[56px] w-[119px] flex-row items-center justify-center gap-2 rounded-l-md bg-[#E2E8F0]"
          >
            <Text className="text-['#64748B']">
              {countryCode ? countryCode : "+ 33"}
            </Text>
            <Text className="text-['#64748B']">▼</Text>
          </TouchableOpacity>
          <View>
            <CountryPicker
              show={show}
              onBackdropPress={() => setShow(false)}
              // showOnly={["FR", "BE", "CH", "LU"]}
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setShow(false);
              }}
              inputPlaceholder="Rechercher une ville"
              lang="fr"
              style={{
                modal: {
                  maxHeight: 300,
                },
              }}
            />
          </View>
        </View>
        <TextInput
          className="my-10 h-[56px] w-[216px] rounded-r-md border-l-transparent bg-white p-2"
          textContentType="telephoneNumber"
          keyboardType="numeric"
          inputMode="numeric"
          placeholder="6 12 34 56 78"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
        />
      </View>
    </View>
  );
};

export default Step3PhoneNumber;
