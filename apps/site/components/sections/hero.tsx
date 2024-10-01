"use client";

import { motion } from "framer-motion";

import { UploadVideoForm } from "../upload-video-form";

export function Hero({
  currentUser,
}: {
  currentUser?: {
    username: string;
    name?: string;
    avatarUrl?: string;
    id: string;
  };
}) {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {currentUser ? (
                  <>
                    Welcome Back,{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {currentUser?.username}
                    </span>
                  </>
                ) : (
                  <>Share Your Road Trip Adventure</>
                )}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                Ready to share your next amazing road trip adventure? Upload
                your video and inspire fellow travelers!
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <UploadVideoForm />
    </>
  );
}
