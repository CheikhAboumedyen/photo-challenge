// src/components/navigation/app-footer.tsx
import Link from "next/link";
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-nav-border/40 bg-panel/80 backdrop-blur-xl text-sm text-white/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-4">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-white tracking-tight">
              PixiVerse
            </p>
            <p className="text-xs text-white/50">
              A creative space where photographers grow together.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-4 text-xs sm:justify-end">
            <Link href="/" className="transition hover:text-white">
              Landing
            </Link>
            <Link href="/home" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/submissions" className="transition hover:text-white">
              Submissions
            </Link>
            <Link href="/leaderboard" className="transition hover:text-white">
              Leaderboard
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <FaFacebook className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <FaWhatsapp className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <FaInstagram className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <p className="mt-5 text-center text-[11px] text-white/40 sm:text-right">
          © {currentYear} PixiVerse · Made in Mauritania.
        </p>
      </div>
    </footer>
  );
}
