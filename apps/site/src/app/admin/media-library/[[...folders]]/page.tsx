import { graphql } from "@grinn/graphql";

import { AdminBreadcrumb } from "@/components/layout/admin-breadcrumb";
import { query } from "@/graphql/server";
import { getFolderContent } from "./_graphql/get-folder";
import { AssetFolders } from "./components/asset-folders-section";
import { AssetsSection } from "./components/assets-section";
import { CreateFolderForm } from "./components/create-folder-form";
import { UploadAssetForm } from "./components/upload-asset";

export default async function MediaLibraryPage({
  params: { folders },
}: {
  params: {
    folders?: string[];
  };
}) {
  const { data, error } = await query({
    query: getFolderContent,
    variables: {
      folderSlug: folders?.[folders?.length - 1] || "root",
    },
  });

  return (
    <main className="container">
      <AdminBreadcrumb
        page={folders ? folders[folders.length - 1] : "Médiathèque"}
        ancestors={[
          {
            name: "Accueil",
            href: "/admin",
          },
          ...(folders
            ? [
                {
                  name: "Médiathèque",
                  href: "/admin/media-library",
                },
              ]
            : []),
          ...(folders
            ? folders
                ?.filter((x) => !!x)
                ?.slice(0, -1)
                ?.map((folder, index) => ({
                  name: folder,
                  href: `/admin/media-library/${folders.slice(0, index + 1).join("/")}`,
                }))
            : []),
        ]}
      />
      <div className="mt-8 flex w-full flex-wrap items-baseline justify-between gap-2">
        <h1 className="mt-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Médiathèque
        </h1>
        {data?.assetFolderBySlug?.id ? (
          <div className="flex gap-2">
            <UploadAssetForm
              folderId={data?.assetFolderBySlug?.id}
              ancestors={folders || ["root"]}
            />
            <CreateFolderForm folderId={data?.assetFolderBySlug?.id} />
          </div>
        ) : null}
      </div>
      <AssetFolders
        ancestors={folders?.filter((x) => !!x)}
        folders={
          data?.assetFolderBySlug?.childAssetFolders?.nodes
            ?.filter((folder) => !!folder)
            .map((folder) => ({
              id: folder.id,
              name: folder.name,
              slug: folder.slug,
              totalAssets: folder.assets.totalCount,
              totalFolders: folder.childAssetFolders.totalCount,
            })) || []
        }
      />
      <AssetsSection
        assets={
          data?.assetFolderBySlug?.assets?.nodes
            .filter((asset) => !!asset)
            .map((asset) => ({
              id: asset.id,
              name: asset.name,
              mimeType: asset.mimeType,
              size: asset.size,
              height: asset.height,
              width: asset.width,
              url: asset.url,
            })) || []
        }
      />
    </main>
  );
}
