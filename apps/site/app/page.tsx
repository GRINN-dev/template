import { Hero } from "@/components/sections/hero";
import { VideoGallery } from "@/components/sections/video-gallery";
import { query } from "@/graphql/apollo-client-ss";
import { profileQuery } from "./(my-space)/mon-compte/_graphql/profile-query";

export const runtime = "edge";

export default async function HomePage() {
  const { data } = await query({
    query: profileQuery,
    context: {
      fetchOptions: {
        next: {
          tags: ["profile"],
        },
      },
    },
  });
  return (
    <>
      <Hero currentUser={data?.currentUser} />
      {data?.currentUser?.videos?.nodes?.length ? (
        <VideoGallery
          videos={data.currentUser.videos.nodes.map((video) => ({
            title: video.title,
            url: video.signedVideoUrl,
          }))}
        />
      ) : null}
    </>
  );
}
