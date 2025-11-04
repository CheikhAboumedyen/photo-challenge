"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SignupForm } from "@/components/forms/signup-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/20 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <motion.div
          key="signup"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <SignupForm />
        </motion.div>
      </div>
    </div>
  );
}
