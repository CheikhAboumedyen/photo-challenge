// src/app/(admin)/layout.tsx
import { ReactNode } from "react";
import { NavbarAdmin } from "@/components/navbar-admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <NavbarAdmin />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
