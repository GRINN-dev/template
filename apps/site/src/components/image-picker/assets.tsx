"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Asset } from "./types";

export function AssetsSection({
  assets,
  onSelect,
}: {
  assets: Asset[];
  onSelect: (value: string) => void;
}) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">Mes assets</h2>
      {assets.length === 0 ? (
        <p>Aucun asset disponible.</p>
      ) : (
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}

export function AssetCard({
  asset,
  onSelect,
}: {
  asset: Asset;
  onSelect?: (value: string) => void;
}) {
  const renderPreview = (asset: Asset) => {
    if (asset.mimeType?.startsWith("image/")) {
      return <img src={asset.url} alt={asset.name} className="h-full w-full" />;
    } else if (asset.mimeType?.startsWith("video/")) {
      return <video src={asset.url} controls className="h-full w-full" />;
    } else if (asset.mimeType?.startsWith("audio/")) {
      return <audio src={asset.url} controls className="" />;
    } else {
      return (
        <div className="flex h-full items-center justify-center">
          No preview available
        </div>
      );
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex h-48 items-center justify-center bg-gray-100">
        {renderPreview(asset)}
      </div>
      <div className="flex grow flex-col">
        <CardHeader>
          <span className="text-xs font-semibold">{asset.name}</span>
        </CardHeader>
        <CardContent className="grow">
          <table className="w-full rounded border font-mono text-xs">
            <tbody>
              <tr className="bg-gray-100">
                <td>Size</td>
                <td>{formatSize(asset?.size)}</td>
              </tr>
              <tr>
                <td>mime</td>
                <td>{asset.mimeType}</td>
              </tr>
              {asset.width ? (
                <tr className="bg-gray-100">
                  <td>Dimensions</td>
                  <td>
                    {asset.width}x{asset.height}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-gray-500">
          <Button variant="link" onClick={() => onSelect?.(asset.id)}>
            Selectionner
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

const formatSize = (size: Nullish<number>) => {
  // this function returns the size of the file in the most meaningful and readable unit according to the value (bytes, KB, MB, GB, TB)
  if (!size) {
    return "Unknown";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let sizeInUnit = size;

  while (sizeInUnit >= 1024 && unitIndex < units.length - 1) {
    sizeInUnit /= 1024;
    unitIndex++;
  }

  return `${sizeInUnit.toFixed(2)} ${units[unitIndex]}`;
};
