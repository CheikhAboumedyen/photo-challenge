"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NavbarUser() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isAuthed = !!session?.user;
  if (!session) return null;

  const role = (session.user as typeof session.user & { role?: string })?.role;

  const links = !isAuthed
    ? [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Login", href: "/login" },
        { name: "Signup", href: "/signup" },
      ]
    : role === "admin"
    ? [
        { name: "Home", href: "/home" },
        { name: "Admin Panel", href: "/admin" },
        { name: "Leaderboard", href: "/leaderboard" },
        { name: "Profile", href: "/profile" },
      ]
    : [
        { name: "Home", href: "/home" },
        { name: "My Submission", href: "/challenges/my-submission" },
        { name: "Leaderboard", href: "/leaderboard" },
        { name: "Profile", href: "/profile" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/60 border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-gray-800">
        {/* Left - Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight bg-linear-to-r from-indigo-500 to-pink-400 bg-clip-text text-transparent"
        >
          PixiVerse
        </Link>

        {/* Center - Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-500 after:transition-all hover:after:w-full ${
                pathname === link.href
                  ? "text-indigo-600 after:w-full"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right - Auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthed ? (
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => {
                authClient.signOut();
                router.push("/");
              }}
            >
              Sign out
            </Button>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600"
          onClick={() => setOpen(!open)}
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
            transition={{ duration: 0.2 }}
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

              <div className="pt-4 border-t border-gray-200 w-3/4">
                {isAuthed ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-300 hover:bg-gray-100 mt-3"
                    onClick={() => {
                      authClient.signOut();
                      router.push("/");
                      setOpen(false);
                    }}
                  >
                    Sign out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 mt-3">
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
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// // src/components/navbar-user.tsx
// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { Button } from "@/components/ui/button";

// export function NavbarUser() {
//   const { data: session } = authClient.useSession();
//   const pathname = usePathname();
//   const router = useRouter();

//   const isAuthed = !!session?.user;
//   if (!session) return null; // or a loading state
//   const role = (session.user as typeof session.user & { role?: string })?.role;

//   const links = !isAuthed
//     ? [
//         { name: "Home", href: "/" },
//         { name: "About", href: "/about" },
//         { name: "Login", href: "/login" },
//         { name: "Signup", href: "/signup" },
//       ]
//     : role === "admin"
//     ? [
//         { name: "Home", href: "/home" },
//         { name: "Admin Panel", href: "/admin" },
//         { name: "Leaderboard", href: "/leaderboard" },
//         { name: "Profile", href: "/profile" },
//       ]
//     : [
//         { name: "Home", href: "/home" },
//         { name: "My Submission", href: "/challenges/my-submission" },
//         { name: "Leaderboard", href: "/leaderboard" },
//         { name: "Profile", href: "/profile" },
//       ];

//   return (
//     <header className="sticky top-0 z-50 border-b bg-white">
//       <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-gray-800">
//         {/* Left - Logo */}
//         <Link href="/" className="font-semibold text-lg hover:opacity-80">
//           Photo Challenges
//         </Link>

//         {/* Center - Nav links */}
//         <div className="flex items-center gap-6 text-sm font-medium">
//           {links.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className={`transition hover:text-black ${
//                 pathname === link.href
//                   ? "text-black font-semibold"
//                   : "text-gray-700"
//               }`}
//             >
//               {link.name}
//             </Link>
//           ))}
//         </div>

//         {/* Right - Auth actions */}
//         <div className="flex items-center gap-3">
//           {isAuthed ? (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 authClient.signOut();
//                 router.push("/");
//               }}
//             >
//               Sign out
//             </Button>
//           ) : (
//             <Button
//               size="sm"
//               className="bg-gray-900 text-white hover:bg-black"
//               onClick={() => router.push("/login")}
//             >
//               Get Started
//             </Button>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }
