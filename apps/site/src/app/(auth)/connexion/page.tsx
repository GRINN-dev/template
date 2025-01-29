import { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="mt-12 flex items-center justify-center">
      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="self-center whitespace-nowrap text-3xl font-semibold tracking-tight">
              Me connecter à mon compte{" "}
            </h1>
            <p className="text-md text-muted-foreground">
              Renseigner votre email et votre mot de passe pour accéder à votre
              compte
            </p>
          </div>
          {/* ici formulaire */}
          <LoginForm />
          <Link
            href="/mot-de-passe-oublie"
            className={cn(buttonVariants({ variant: "ghost" }), "mt-4")}
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
}
