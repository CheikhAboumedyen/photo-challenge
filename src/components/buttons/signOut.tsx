// src\components\buttons\signOut.tsx

"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client"; // adjust path if needed
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function SignOut() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out!");
      router.push("/"); // redirect to welcome page
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      size="sm"
      onClick={handleLogout}
    >
      Sign out
    </Button>
  );
}
