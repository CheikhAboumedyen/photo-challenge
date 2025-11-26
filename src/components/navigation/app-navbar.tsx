"use client";

import { authClient } from "@/lib/auth/auth-client";
import { NavbarAdmin } from "@/components/navigation/navbar-admin";
import { NavbarPublic } from "@/components/navigation/navbar-public";
import { NavbarUser } from "@/components/navigation/navbar-user";

export function AppNavbarClient() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const role = user?.role;

  if (isPending) {
    // small loading skeleton or nothing
  }

  if (!user) return <NavbarPublic />;
  if (role === "admin") return <NavbarAdmin />;

  return <NavbarUser initialUser={user} />;
}
