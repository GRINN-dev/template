import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import BottomButtonStepper from "../bottom-button-stepper";

interface OnboardingStepperProps {
  buttonIsFixed: boolean;
}

const Step4OnboardingVerifyCode = (props: {
  props: OnboardingStepperProps;
}) => {
  const [codeInput, setCodeInput] = useState("");
  //   const [validatePhoneNumber, { loading: loadingValidationPhone }] =
  //     useValidatePhoneNumberMutation();
  const handleChangeText = (text: string) => {
    setCodeInput(text);
  };

  const validateStep = async () => {
    // await client
    //   .mutate({
    //     mutation: UpdateUser,
    //     variables: {
    //       id: currentUser?.currentUser?.id,
    //       patch: {
    //         phoneNumber: phoneNumber,
    //       },
    //     },
    //     refetchQueries: ["currentUser"],
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   })
    //   .then(() => {
    //     onboardingStore.nextStep();
    //   });
  };

  return (
    <>
      <ScrollView>
        <Text>Code de vérification</Text>
        <View className="w-full items-center bg-green-500 p-4">
          <View style={styles.inputContainer}>
            <TextInput
              value={codeInput}
              //   editable={!loadingValidationPhone}
              onChangeText={handleChangeText}
              maxLength={4}
              textAlign="left"
              keyboardType="numeric"
              inputMode="numeric"
              textContentType="oneTimeCode"
              style={[
                styles.textInput,
                {
                  paddingLeft: Platform.OS === "ios" ? 16 : 0,
                },
              ]}
            />

            {/* Diviseurs visuels */}
            <View style={styles.preseparator} />
            <View style={styles.separator} />
            <View style={styles.postseparator} />
            <View style={[styles.preseparator, { left: "43%" }]} />
            <View style={[styles.separator, { left: "45%" }]} />
            <View style={[styles.postseparator, { left: "51%" }]} />
            <View style={[styles.preseparator, { left: "68%" }]} />
            <View style={[styles.separator, { left: "70%" }]} />
            <View style={[styles.postseparator, { left: "76%" }]} />
          </View>
        </View>
        {!props?.props?.buttonIsFixed && (
          <BottomButtonStepper
            title="Continuer"
            onPress={() => {
              validateStep();
            }}
            isFixed={false}
          />
        )}
      </ScrollView>
      {props?.props?.buttonIsFixed && (
        <BottomButtonStepper
          title="Continuer"
          onPress={() => {
            validateStep();
          }}
          isFixed={true}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  inputContainer: {
    position: "relative",
    width: 224, // Largeur totale de l'input
  },
  textInput: {
    height: 48,
    width: "100%",
    borderRadius: 5,
    textAlign: "left",
    color: "#000",
    backgroundColor: "#fff",
    fontSize: 18,
    letterSpacing: 46,
  },
  preseparator: {
    position: "absolute",
    height: 48,
    width: 8,
    zIndex: 2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: "white", // Couleur du diviseur
    top: 0,
    left: "18%", // Positionnement du premier diviseur
  },
  separator: {
    position: "absolute",
    height: 48,
    width: 20,
    backgroundColor: "#F7F6F0", // Couleur du diviseur
    top: 0,
    left: "20%", // Positionnement du premier diviseur
  },
  postseparator: {
    position: "absolute",
    height: 48,
    width: 8,
    zIndex: 2,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: "white", // Couleur du diviseur
    top: 0,
    left: "26%", // Positionnement du premier diviseur
  },
});

export default Step4OnboardingVerifyCode;
