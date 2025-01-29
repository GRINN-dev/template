"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "@/hooks/use-toast";

const UploadAssetFormSchema = z.object({
  file: z.any(),
  alt: z.string(),
  caption: z.string().optional(),
});

export function UploadAssetForm({
  folderId,
  ancestors,
}: {
  folderId: string;
  ancestors: string[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof UploadAssetFormSchema>>({
    resolver: zodResolver(UploadAssetFormSchema),
  });
  // formState
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitionning, startTransition] = useTransition();
  const isSubmitting = isLoading || isTransitionning;
  // uploadProgress
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const onSubmit = async (data: z.infer<typeof UploadAssetFormSchema>) => {
    setIsLoading(true);
    // Initialiser la progression
    setUploadProgress(0);

    try {
      // Créer un objet FormData pour envoyer les données
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("alt", data.alt);
      formData.append("assetFolderId", folderId);
      formData.append("slug", ancestors.join("/"));
      data.caption ? formData.append("caption", data.caption) : null;
      // Créer une requête XHR pour suivre la progression de l'envoi du fichier
      const xhr = new XMLHttpRequest();
      // Configurer la requête POST pour envoyer le fichier à l'API
      xhr.open("POST", `/upload`, true);

      // Suivi de la progression
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      // Gérer la réponse de l'API
      xhr.onload = () => {
        if (xhr.status === 200) {
          toast({
            title: "Fichier ajouté",
          });
          setIsLoading(false);
        } else {
          console.error(xhr.statusText);
          toast({
            variant: "destructive",
            title: "Erreur lors de l'ajout du fichier",
          });
          setIsLoading(false);
        }
      };

      xhr.onerror = () => {
        console.error("Erreur réseau");
        toast({
          variant: "destructive",
          title: "Une erreur réseau s'est produite",
        });
        setIsLoading(false);
      };
      // Réinitialiser la progression et le formulaire à la fin de la requête
      xhr.onloadend = () => {
        setUploadProgress(null);
        form.reset();
        setOpen(false);
        startTransition(() => {
          router.refresh();
        });
      };
      // Envoyer les données au serveur
      xhr.send(formData);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Une erreur s'est produite",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        <Plus />
        Ajouter un fichier
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un fichier</DialogTitle>
          <DialogDescription>
            {/* Formulaire de création d'un asset */}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      uploadProgress={uploadProgress}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texte alternatif</FormLabel>
                  <FormControl>
                    <Input placeholder="Texte alternatif" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caption"
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
