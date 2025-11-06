// src/app/(user)/layout.tsx
import { ReactNode } from "react";
import { NavbarUser } from "@/components/navbar-user";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <NavbarUser />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
