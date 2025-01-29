import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { graphql } from "@grinn/graphql";

import { setStoreItemAsync } from "@/components/secure-store";

const loginForm = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginForm),
  });

  const [loginMutation] = useMutation(LoginMutation, {
    fetchPolicy: "network-only",
  });

  const [loadingCurrentUser] = useLazyQuery(CurrentUserQuery);

  const onSubmit = (data: any) => {
    loginMutation({
      variables: { email: data?.email, password: data?.password },
      refetchQueries: ["CurrentUserQuery"],
    })
      .then(async (res) => {
        if (res.data?.login?.accessToken && res.data?.login?.refreshToken) {
          await setStoreItemAsync("access_token", res.data.login.accessToken);
          await setStoreItemAsync("refresh_token", res.data.login.refreshToken);
        }
        const { data } = await loadingCurrentUser();
        if (data?.currentUser) router.navigate("/auth/(tabs)");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        console.log("finally");
      });
  };

  return (
    <View>
      <Text>Login</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            // style={styles.input}
            onBlur={onBlur}
            autoCapitalize={"none"}
            onChangeText={onChange}
            value={value}
            placeholder="Enter your email"
          />
        )}
      />
      <Text>{JSON.stringify(errors?.email?.message)}</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            // style={styles.input}
            onBlur={onBlur}
            autoCapitalize={"none"}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
          />
        )}
      />
      <Text>{JSON.stringify(errors?.password?.message)}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log("onPress");
          handleSubmit(onSubmit)();
        }}
      >
        <Text>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`);

const CurrentUserQuery = graphql(`
  query CurrentUser {
    currentUser {
      id
      email
      firstname
      lastname
    }
  }
`);
