import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { Link, router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { graphql } from "@grinn/graphql";

import { client } from "@/components/apollo";

const Login = () => {
  const formSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>
        <Text className="text-xl">Connectez-vous</Text>
        <Controller
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              keyboardType="default"
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Pseudonyme"
              autoCapitalize="none"
              style={styles.input}
            />
          )}
          name="username"
          rules={{ required: true }}
        />

        <Controller
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Mot de passe"
              keyboardType="visible-password"
              autoCapitalize="none"
              style={styles.input}
            />
          )}
          name="password"
        />

        <Pressable
          style={styles.button}
          onPress={async () => {
            await client
              .mutate({
                mutation: loginMutation,
                variables: {
                  username: form.getValues("username"),
                  password: form.getValues("password"),
                },
              })
              .catch((error) => {
                console.error(error);
              })
              .then(() => {
                console.log("Login success");
                router.push("/(home)");
              });
          }}
        >
          <Text style={styles.buttonText}>Valider </Text>
        </Pressable>

        <Text>
          Vous n&apos;avez pas de compte ?{" "}
          <Link href={{ pathname: "/(auth)/register" }} className="underline">
            Inscrivez-vous
          </Link>
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Login;

const loginMutation = graphql(`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        name
      }
    }
  }
`);

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
