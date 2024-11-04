"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { graphql } from "@grinn/graphql";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import client from "@/graphql/apollo-client";

// register scheme
const formScheme = z.object({
  username: z.string().min(2).max(255),
  password: z.string().min(8),
});

// Redirect URI for Google OAuth
const redirectUri = `${window.location.origin}/auth/register/callback`;
const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;

export function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitionning, startTransition] = useTransition();
  const isSubmitting = isLoading || isTransitionning;
  async function onSubmit(data: z.infer<typeof formScheme>) {
    setIsLoading(true);
    await client
      .mutate({
        mutation: loginMutation,
        variables: {
          username: data.username,
          password: data.password,
        },
      })
      .then(({ data: res }) => {
        if (res?.login?.user) {
          toast({
            title: "Bienvenue !",
            description: "Votre compte a été créé avec succès.",
          });
          setIsLoading(false);
          startTransition(() => {
            router.replace("/ma-bibliotheque");
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Une erreur s'est produite",
          description: JSON.stringify(error),
        });
        setIsLoading(false);
      });
  }
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Connectez-vous</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="grid gap-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pseudonyme</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Votre mot de passe</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={!form.formState.isValid}
          >
            Login
          </Button>
        </form>
      </Form>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          window.location.href = googleOAuthURL;
        }}
      >
        Login with Google
      </Button>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

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
