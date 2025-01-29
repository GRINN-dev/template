import { Folder } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AssetFolder } from "./types";

export function AssetFolders({
  folders,
  ancestors,
  onSelect,
}: {
  folders: AssetFolder[];
  ancestors?: string[];
  onSelect: (value: string, slug: string) => void;
}) {
  return (
    <section className="">
      <h2 className="mt-6 text-lg font-semibold">Mes dossiers</h2>
      {folders.length === 0 ? (
        <p>Aucun dossier disponible.</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onSelect(folder.id, folder.slug)}
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
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
