"use client";

import { authClient } from "@/lib/auth-client";
import { NavbarAdmin } from "@/components/navbar-admin";
import { NavbarPublic } from "@/components/navbar-public";
import { NavbarUser } from "@/components/navbar-user";

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
