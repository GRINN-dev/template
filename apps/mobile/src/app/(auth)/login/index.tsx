import React from "react";
import { Button, SafeAreaView, Text, TextInput } from "react-native";
import { Link } from "expo-router";
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
          />
        )}
        name="username"
        rules={{ required: true }}
      />
      {form.formState.errors.username && (
        <Text>{form.formState.errors.username.message! as string}</Text>
      )}

      {/* <TextInput style={styles.input} secureTextEntry {...form.register('password')} /> */}
      <Controller
        control={form.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            // secureTextEntry={!isPasswordVisible}
            placeholder="Mot de passe"
            keyboardType="visible-password"
            autoCapitalize="none"
          />
        )}
        name="password"
      />

      <Button
        title="Login"
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
            });
        }}
      />

      <Text>
        Vous n&apos;avez pas de compte ?{" "}
        <Link href={{ pathname: "/(auth)/register" }} className="underline">
          Inscrivez-vous
        </Link>
      </Text>
    </SafeAreaView>
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
