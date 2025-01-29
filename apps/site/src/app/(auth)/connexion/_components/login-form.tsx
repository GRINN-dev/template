"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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

import { getClient } from "@/graphql/client";
import { toast } from "@/hooks/use-toast";

// register scheme
const formScheme = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitionning, startTransition] = useTransition();
  const isSubmitting = isLoading || isTransitionning;
  async function onSubmit(data: z.infer<typeof formScheme>) {
    setIsLoading(true);
    await getClient()
      .mutate({
        mutation: loginMutation,
        variables: {
          email: data.email,
          password: data.password,
        },
      })
      .then(({ data: res }) => {
        console.log(res);
        if (res?.login?.user) {
          setIsLoading(false);
          startTransition(() => {
            router.replace("/");
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="grid gap-2"
        >
          <div className="grid gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                  <Input {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={!form.formState.isValid || isSubmitting}
          >
            Login {isSubmitting && <Loader className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  );
}

const loginMutation = graphql(`
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
