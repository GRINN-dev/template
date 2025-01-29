"use client";

import Link from "next/link";
import { Folder } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AssetFolder = {
  id: string;
  slug: string;
  name: string;
  totalAssets: Nullish<number>;
  totalFolders: Nullish<number>;
};

export function AssetFolders({
  folders,
  ancestors,
}: {
  folders: AssetFolder[];
  ancestors?: string[];
}) {
  return (
    <section className="">
      <h2 className="mt-6 text-lg font-semibold">Mes dossiers</h2>
      {folders.length === 0 ? (
        <p>Aucun dossier disponible.</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/admin/media-library/${
                ancestors ? ancestors.join("/") + "/" : ""
              }${folder.slug}`}
            >
              <Card>
                <CardHeader className="p-2">
                  <CardTitle className="line-clamp-1 text-sm">
                    <Folder className="mr-2 inline-block h-6 w-6 text-teal-300" />
                    {folder.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {folder.totalAssets || "0"} assets,{" "}
                    {folder.totalFolders || "0"} dossiers
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
