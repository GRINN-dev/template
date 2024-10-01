"use client";

import { useState, useTransition } from "react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResultOf } from "gql.tada";
import { LoaderPinwheel } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import client from "@/graphql/apollo-client";
import clearCachesByServerAction from "@/lib/revalidateTags";
import { cn } from "@/lib/utils";
import { updateProfileMutation } from "../_graphql/profile-mutations";
import { profileQuery } from "../_graphql/profile-query";

const formSchema = z.object({
  username: z.string().optional(),
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
});
export function ManageProfile({
  profile,
  className,
}: {
  profile: NonNullable<ResultOf<typeof profileQuery>["currentUser"]>;
  className?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: profile.username || undefined,
      name: profile.name || undefined,
      avatarUrl: profile.avatarUrl || undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTransitionning, startTransition] = useTransition();
  const isSubmitting = isLoading || isTransitionning;

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    await client
      .mutate({
        mutation: updateProfileMutation,
        variables: {
          input: {
            id: profile.id,
            patch: data,
          },
        },
      })
      .then(({ data: res }) => {
        if (res?.updateUser?.user) {
          toast({
            title: "Profil Modifié",
            description: "Votre profil a été modifié avec succès.",
          });
          setIsLoading(false);
          startTransition(() => {
            clearCachesByServerAction({
              method: "tag",
              value: "profile",
            });
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
  });

  return (
    <Card className={cn("mt-8", className)}>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
            <CardDescription>
              Gérez votre profil utilisateur, Ces informations sont visibles par
              les autres utilisateurs de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderPinwheel className="animate-spin" /> Enregistrement en
                  cours
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
