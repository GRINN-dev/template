import { graphql } from "@grinn/graphql";

export const getFolderContent = graphql(`
  query getFolderContent($folderSlug: String!) {
    assetFolderBySlug(slug: $folderSlug) {
      id
      name
      assets {
        totalCount
        nodes {
          id
          name
          mimeType
          size
          height
          width
          url
        }
      }
      childAssetFolders {
        totalCount
        nodes {
          id
          name
          slug
          assets {
            totalCount
          }
          childAssetFolders {
            totalCount
          }
        }
      }
    }
  }
`);
