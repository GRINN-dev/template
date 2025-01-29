"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { graphql } from "@grinn/graphql";

import FileUpload from "@/components/file-upload";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { client } from "@/graphql/client";
import { toast } from "@/hooks/use-toast";

const CreateFolderFormSchema = z.object({
  name: z.string(),
});

export function CreateFolderForm({ folderId }: { folderId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateFolderFormSchema>>({
    resolver: zodResolver(CreateFolderFormSchema),
  });
  // formState
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitionning, startTransition] = useTransition();
  const isSubmitting = isLoading || isTransitionning;
  // uploadProgress

  const onSubmit = async (data: z.infer<typeof CreateFolderFormSchema>) => {
    setIsLoading(true);
    client
      .mutate({
        mutation: createFolderMutation,
        variables: { folderId, name: data.name },
      })
      .then(() => {
        setIsLoading(false);
        form.reset();
        startTransition(() => {
          router.refresh();
        });
        setOpen(false);
        toast({ title: "Dossier créé avec succès" });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({ title: "Une erreur s'est produite", variant: "destructive" });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        <Plus />
        Ajouter un dossier
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un dossier</DialogTitle>
          <DialogDescription>
            {/* Formulaire de création d'un dossier */}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Légende</FormLabel>
                  <FormControl>
                    <Input placeholder="Légende" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSubmitting}
              >
                <CirclePlus /> Ajouter{" "}
                {isSubmitting && <Loader className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const createFolderMutation = graphql(`
  mutation CreateFolder($folderId: UUID!, $name: String!) {
    createAssetFolder(
      input: { assetFolder: { parentId: $folderId, name: $name } }
    ) {
      assetFolder {
        id
      }
    }
  }
`);
