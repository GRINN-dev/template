"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";

import { getAsset } from "@/app/admin/media-library/[[...folders]]/_graphql/get-asset";
import { getFolderContent } from "@/app/admin/media-library/[[...folders]]/_graphql/get-folder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { AssetCard, AssetsSection } from "./assets";
import { AssetFolders } from "./folders";

export function ImagePicker({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value?: string;
}) {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(value);
  const [open, setOpen] = useState(false);

  const {
    data: folderData,
    loading: folderLoading,
    error: folderError,
  } = useQuery(getFolderContent, {
    variables: {
      folderSlug: folders?.[folders?.length - 1] || "root",
    },
  });

  const {
    data: assetData,
    loading: assetLoading,
    error: assetError,
  } = useQuery(getAsset, {
    variables: {
      id: selectedAsset!,
    },
    skip: !selectedAsset,
  });

  const myFolders =
    folderData?.assetFolderBySlug?.childAssetFolders?.nodes
      ?.filter((folder) => !!folder)
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
        slug: folder.slug,
        totalAssets: folder.assets.totalCount,
        totalFolders: folder.childAssetFolders.totalCount,
      })) || [];
  const myAssets =
    folderData?.assetFolderBySlug?.assets?.nodes
      .filter((asset) => !!asset)
      .map((asset) => ({
        id: asset.id,
        name: asset.name,
        mimeType: asset.mimeType,
        size: asset.size,
        height: asset.height,
        width: asset.width,
        url: asset.url,
      })) || [];
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>open</DialogTrigger>
        <DialogContent>
          {/* choix de l'image, deux tabs: nouvelle image et choisir depuis la médiathèque */}
          <Tabs defaultValue="existing" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Existing</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
            <TabsContent value="existing">
              {folderLoading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <AssetFolders
                    folders={myFolders}
                    onSelect={(_folderId, slug) => {
                      setFolders([...folders, slug]);
                    }}
                  />
                  <AssetsSection
                    assets={myAssets}
                    onSelect={(id) => {
                      onChange(id);
                      setSelectedAsset(id);
                      setOpen(false);
                    }}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="new"></TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* image sélectionnée */}
      {assetData?.asset?.url ? <AssetCard asset={assetData?.asset} /> : null}
    </div>
  );
}
