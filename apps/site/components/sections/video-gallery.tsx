"use client";

export function VideoGallery({
  videos,
}: {
  videos: { title: string; url: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <div
          key={video.url}
          className="group relative transform overflow-hidden rounded-xl shadow-2xl transition-transform duration-500 hover:rotate-1 hover:scale-110"
        >
          <div className="relative">
            <video
              className="h-full w-full rounded-xl object-cover transition-opacity duration-300 group-hover:opacity-75"
              controls
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button className="transform rounded-full bg-white bg-opacity-80 p-4 text-black shadow-lg transition-transform duration-300 hover:scale-110">
                ▶
              </button>
            </div>
          </div>

          {/* Hover Info */}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black via-transparent to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p className="text-xl font-semibold text-white drop-shadow-md">
              {video.title}
            </p>
          </div>

          {/* Fancy Border Animation */}
          <div className="absolute inset-0 rounded-xl border-4 border-transparent transition-all duration-500 group-hover:border-indigo-400"></div>
        </div>
      ))}
    </div>
  );
}
