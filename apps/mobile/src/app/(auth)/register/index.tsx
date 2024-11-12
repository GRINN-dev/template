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

import { graphql } from "@grinn/graphql";

import { client } from "@/components/apollo";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView className="w-full">
        <Text className="pl-14 text-xl">Inscription</Text>
        <View className="mx-14">
          <TextInput
            keyboardType="default"
            onChangeText={(text) => setUsername(text)}
            placeholder="Pseudonyme"
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
            onPress={async () => {
              await client
                .mutate({
                  mutation: registerMutation,
                  variables: {
                    input: {
                      username: username,
                      email: email,
                      password: password,
                    },
                  },
                })
                .catch((error) => {
                  console.error(error);
                })
                .then(() => {
                  console.log("Register success");
                  setEmail("");
                  setUsername("");
                  setPassword("");
                  router.replace("/(home)");
                });
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
      user {
        id
        username
      }
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
