import Image from "next/image";

import { Login } from "./_components/login-form";

export default async function LoginPage() {
  return (
    <div className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <Login />
      </div>
      <div className="relative hidden h-screen bg-muted lg:block">
        <Image
          src="/images/bookshelves.jpg"
          alt="Aerial view of a library filled with books"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <span className="absolute bottom-4 right-4 text-sm text-white/50">
          Photo de{" "}
          <a href="https://unsplash.com/fr/@wiryantirta?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            Wiryan Tirtarahardja
          </a>{" "}
          sur{" "}
          <a href="https://unsplash.com/fr/photos/une-vue-aerienne-dune-bibliotheque-remplie-de-livres-FztmY-4kqdg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            Unsplash
          </a>
        </span>
      </div>
    </div>
  );
}
