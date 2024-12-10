/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useQuery } from "@apollo/client";

import { graphql } from "@grinn/graphql";

import { client } from "@/components/apollo";

const Register = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: currentUser, error } = useQuery(CurrentUser, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data.currentUser) {
        router.replace("/(auth)/login");
      }
    },
    onError: (e) => {
      console.log("Erreur lors de la récupération de l'utilisateur :", e);
    },
  });
  console.log(currentUser, error, "currentUserLoginScreen");
  async function onboard() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await client
        .mutate({
          mutation: registerMutation,
          variables: {
            input: {
              username: email,
              email: email,
              password: password,
            },
          },
        })
        .then(async ({ data }) => {
          data?.register?.accessToken &&
            (await SecureStore.setItemAsync(
              "access_token",
              data?.register?.accessToken,
            ));
          data?.register?.refreshToken &&
            (await SecureStore.setItemAsync(
              "refresh_token",
              data?.register?.refreshToken,
            ));
          return data?.register?.user?.id;
        })
        .then(() => {
          router.push("/(home)");
        })
        .catch((e) => {
          console.log(e);
          router.push("/");
        });
    } catch (e) {
      console.log(e);
      router.push("/");
    }
    setIsLoading(false);
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView className="w-full">
        <Text className="pl-14 text-xl">Inscription</Text>
        <View className="mx-14">
          <TextInput
            keyboardType="default"
            onChangeText={(text) => setUsername(text)}
            placeholder="Pseudo"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            onChangeText={(text) => setPassword(text)}
            placeholder="Mot de passe"
            keyboardType="visible-password"
            autoCapitalize="none"
            style={styles.input}
          />
          <Pressable
            style={styles.button}
            onPress={() => {
              onboard();
            }}
          >
            <Text style={styles.buttonText}>Valider</Text>
          </Pressable>
          <View className="flex flex-col items-start justify-start gap-4">
            <Text>Vous avez un compte ? </Text>
            <Link href={{ pathname: "/(auth)/login" }} className="underline">
              Connectez-vous
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Register;

const registerMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        username
      }
    }
  }
`);
const CurrentUser = graphql(`
  query currentUser {
    currentUser {
      id
      username
    }
  }
`);
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    paddingVertical: 20,
  },
  input: {
    marginTop: 20,
    height: 64,
    borderColor: "#CDCCC9",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "white",
    padding: 10,
    color: "black",
  },
  button: {
    marginVertical: 20,
    height: 64,
    borderRadius: 6,
    backgroundColor: "white",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});
