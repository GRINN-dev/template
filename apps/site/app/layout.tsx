import type { Metadata, Viewport } from "next";
import { Literata } from "next/font/google";
import { GeistMono } from "geist/font/mono";

import "@/app/globals.css";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { LayoutTransition } from "@/components/layout/layout-transition";
import ResponsiveNavigation from "@/components/layout/nav";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";
import { query } from "@/graphql/apollo-client-ss";
import { cn } from "@/lib/utils";
import { profileQuery } from "./(my-space)/mon-compte/_graphql/profile-query";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

const LiterataVariable = Literata({
  style: ["normal", "italic"],
  weight: ["400", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          LiterataVariable.variable,
          GeistMono.variable,
          "demo-wrap",
        )}
      >
        <LayoutTransition
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="demo-content">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
                <Header currentUser={data?.currentUser} />
                <main className="flex-1">
                  {props.children}
                  {/*   <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Video</CardTitle>
                  <CardDescription>Share your latest road trip adventure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video">Video File</Label>
                      <Input id="video" type="file" accept="video/*" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Video Title</Label>
                      <Input id="title" placeholder="My Epic Road Trip" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Tell us about your adventure..." />
                    </div>
                    <Button type="submit" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  {uploadProgress > 0 && (
                    <div className="w-full space-y-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Contest Status</CardTitle>
                  <CardDescription>Your current standing and upcoming events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Your Rank</h3>
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-2xl font-bold">14th</span>
                        <span className="ml-2 text-sm text-gray-500">out of 156 participants</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Upcoming Deadline</h3>
                      <Badge variant="outline" className="text-orange-500 border-orange-500">
                        5 days left
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Total Views</h3>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-2xl font-bold">3,721</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Leaderboard
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">Your Uploaded Videos</h2>
            <UserUploads />
          </div>
        </section> */}
                </main>
                <Footer />
              </div>
              <div className="absolute bottom-4 right-4">
                <ThemeToggle />
              </div>
              <Toaster />
            </ThemeProvider>
          </div>
        </LayoutTransition>
      </body>
    </html>
  );
}
