"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NavbarPublic() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-gray-200/60">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-gray-800">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold bg-linear-to-r from-indigo-500 to-pink-400 bg-clip-text text-transparent"
        >
          PixiVerse
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full ${
                pathname === link.href
                  ? "text-indigo-600 after:w-full"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={() => router.push("/signup")}
          >
            Signup
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/80 backdrop-blur-md border-t border-gray-200/70 shadow-lg"
          >
            <div className="flex flex-col items-center py-6 space-y-4 text-sm font-medium">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md transition ${
                    pathname === link.href
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:text-indigo-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 w-3/4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-300"
                  onClick={() => {
                    router.push("/login");
                    setOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => {
                    router.push("/signup");
                    setOpen(false);
                  }}
                >
                  Signup
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
