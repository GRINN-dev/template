"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { graphql } from "@/graphql";
import client from "@/graphql/apollo-client";

// register scheme
const formScheme = z
  .object({
    name: z
      .string({
        message: "Votre nom est requis",
      })
      .min(2, {
        message: "Votre nom doit contenir au moins 2 caractères",
      })
      .max(255),
    username: z
      .string({
        message: "Votre pseudonyme est requis",
      })
      .min(2, {
        message: "Votre pseudonyme doit contenir au moins 2 caractères",
      })
      .max(255),
    email: z
      .string({
        message: "Votre email est requis",
      })
      .email(),
    password: z
      .string({
        message: "Votre mot de passe est requis",
      })
      .min(8, {
        message: "Votre mot de passe doit contenir au moins 8 caractères",
      }),
    passwordConfirmation: z
      .string({
        message: "Veuillez confirmer votre mot de passe",
      })
      .min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

// Redirect URI for Google OAuth
const redirectUri = `${window.location.origin}/auth/register/callback`;
const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;

export function Register() {
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
        mutation: registerMutation,
        variables: {
          input: {
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
          },
        },
      })
      .then(({ data: res }) => {
        if (res?.register?.user) {
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
        <h1 className="text-3xl font-bold">Creez un compte</h1>

        <p className="text-balance text-muted-foreground">
          Entrez vos informations pour creer un compte
        </p>
      </div>
      <div className="grid gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
            className="grid gap-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
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
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              name="passwordConfirmation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmez votre mot de passe</FormLabel>
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
      </div>
      <div className="mt-4 text-center text-sm">
        Vous avez déjà un compte?{" "}
        <Link href="/auth/login" className="underline">
          Connectez-vous
        </Link>
      </div>
    </div>
  );
}

const registerMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        username
      }
    }
  }
`);
