import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-6 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Acme Car Rentals. All rights reserved.
          </p>
          <nav className="mt-4 flex gap-4 md:mt-0">
            <Link
              className="text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              href="#"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
