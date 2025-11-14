"use client";

import { motion } from "framer-motion";
import { LoginForm } from "@/components/forms/login-form";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pv-gradient px-4 py-10">
      <motion.div
        key="login"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
}

// // src\app\(auth)\login\page.tsx
// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { LoginForm } from "@/components/forms/login-form";

// export default function Page() {
//   return (
//     <div className="flex min-h-svh w-full items-center justify-center bg-muted/20 p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <motion.div
//           key="login"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.4 }}
//         >
//           <LoginForm />
//         </motion.div>
//       </div>
//     </div>
//   );
// }
