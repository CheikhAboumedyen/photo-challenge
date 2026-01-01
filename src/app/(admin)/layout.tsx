// src\app\(admin)\layout.tsx

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page text-brand-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-12%] top-0 h-80 w-80 rounded-full bg-brand-gradient blur-[220px]" />
        <div className="absolute right-[-8%] bottom-[-10%] h-96 w-96 rounded-full bg-brand-gradient blur-[260px]" />
      </div>

      <main className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
