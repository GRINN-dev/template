import Link from "next/link";
import { Bell, Car, Menu, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NavItems = () => (
  <>
    <Link
      className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      href="#"
    >
      Dashboard
    </Link>
    <Link
      className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      href="#"
    >
      Contest Rules
    </Link>
    <Link
      className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      href="#"
    >
      Leaderboard
    </Link>
  </>
);
export function Header({
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
    <header className="sticky top-0 z-50 flex h-16 items-center bg-white/30 px-4 backdrop-blur-sm dark:bg-gray-800/30 lg:px-6">
      <Link className="flex items-center justify-center" href="#">
        <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white">
          Acme Car Rentals
        </span>
      </Link>
      <nav className="ml-auto hidden items-center gap-4 sm:gap-6 md:flex">
        <NavItems />
        {currentUser ? (
          <Avatar>
            <AvatarImage
              src={currentUser?.avatarUrl}
              alt={currentUser?.username}
            />
            <AvatarFallback>{currentUser?.username[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Link
            href="/auth/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Login
          </Link>
        )}
      </nav>
      <div className="ml-auto md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <NavItems />
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={currentUser?.avatarUrl}
                      alt={currentUser?.username}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {currentUser?.name}
                  </span>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  Login
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
