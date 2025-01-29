export type AssetFolder = {
  id: string;
  slug: string;
  name: string;
  totalAssets: Nullish<number>;
  totalFolders: Nullish<number>;
};

export type Asset = {
  id: string;
  name: string;
  mimeType: Nullish<string>;
  size: Nullish<number>;
  height: Nullish<number>;
  width: Nullish<number>;
  url: string;
};
