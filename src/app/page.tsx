"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8f9fb] via-[#eef1ff] to-[#f4e8ff] text-gray-900 flex flex-col">
      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between flex-1 max-w-7xl mx-auto px-8 py-12 gap-12">
        {/* Left Side */}
        <div className="flex-1 text-left space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900"
          >
            Creative <br />
            <span className="text-indigo-500">Portraits</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-md"
          >
            Join our vibrant community where photographers and artists
            collaborate, share ideas, and challenge each other to create
            extraordinary shots.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="flex items-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
            >
              <ArrowRight size={18} />
              Get Started
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <PlayCircle size={18} />
              Gallery View
            </Button>
          </motion.div>

          {/* Appointment Section */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex items-center gap-3 pt-8"
          >
            <div className="p-3 rounded-full bg-white shadow-sm">
              <Calendar className="text-indigo-500" size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Appointment</h4>
              <p className="text-sm text-gray-500">Book Now</p>
            </div>
          </motion.div> */}
        </div>

        {/* Right Side Illustration */}
        <div className="flex-1 flex justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-[320px] h-[420px] bg-white rounded-4xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100" />
            <div className="relative text-center">
              <div className="w-20 h-20 bg-linear-to-br from-indigo-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight size={30} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                The largest photo gallery
              </h3>
              <p className="text-gray-500 text-sm">
                Explore the creativity of our members
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 text-sm border-t border-gray-200">
        © 2025 PhotoChallenge. All rights reserved.
      </footer>
    </div>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import { ArrowRight, PlayCircle, Calendar } from "lucide-react";
// import { motion } from "framer-motion";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-linear-to-br from-[#f8f9fb] via-[#eef1ff] to-[#f4e8ff] text-gray-900 flex flex-col">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
//         <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
//           Photo<span className="text-indigo-500">Challenge</span>
//         </h1>

//         <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
//           <li>
//             <a href="#" className="hover:text-indigo-500 transition">
//               Home
//             </a>
//           </li>
//           <li>
//             <a href="#" className="hover:text-indigo-500 transition">
//               Create
//             </a>
//           </li>
//           <li>
//             <a href="#" className="hover:text-indigo-500 transition">
//               Plans
//             </a>
//           </li>
//           <li>
//             <a href="#" className="hover:text-indigo-500 transition">
//               About
//             </a>
//           </li>
//           <li>
//             <a href="#" className="hover:text-indigo-500 transition">
//               Contact
//             </a>
//           </li>
//         </ul>

//         <div className="flex items-center space-x-4">
//           <Button variant="outline" size="sm" className="border-gray-300">
//             Login
//           </Button>
//           <Button
//             size="sm"
//             className="bg-indigo-500 hover:bg-indigo-600 text-white"
//           >
//             Sign up
//           </Button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main className="flex flex-col lg:flex-row items-center justify-between flex-1 max-w-7xl mx-auto px-8 py-12 gap-12">
//         {/* Left Side */}
//         <div className="flex-1 text-left space-y-6">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900"
//           >
//             Creative <br />
//             <span className="text-indigo-500">Portraits</span>
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.2 }}
//             className="text-gray-600 text-lg max-w-md"
//           >
//             Join our vibrant community where photographers and artists
//             collaborate, share ideas, and challenge each other to create
//             extraordinary shots.
//           </motion.p>

//           {/* Action Buttons */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4, duration: 1 }}
//             className="flex items-center gap-4 pt-4"
//           >
//             <Button
//               size="lg"
//               className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
//             >
//               <ArrowRight size={18} />
//               Get Started
//             </Button>

//             <Button
//               variant="outline"
//               size="lg"
//               className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//             >
//               <PlayCircle size={18} />
//               Gallery View
//             </Button>
//           </motion.div>

//           {/* Appointment Section */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6, duration: 1 }}
//             className="flex items-center gap-3 pt-8"
//           >
//             <div className="p-3 rounded-full bg-white shadow-sm">
//               <Calendar className="text-indigo-500" size={20} />
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-800">Appointment</h4>
//               <p className="text-sm text-gray-500">Book Now</p>
//             </div>
//           </motion.div>
//         </div>

//         {/* Right Side Illustration */}
//         <div className="flex-1 flex justify-center relative">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1 }}
//             className="w-[320px] h-[420px] bg-white rounded-4xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center relative overflow-hidden"
//           >
//             <div className="absolute inset-0 bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100" />
//             <div className="relative text-center">
//               <div className="w-20 h-20 bg-linear-to-br from-indigo-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <ArrowRight size={30} className="text-white" />
//               </div>
//               <h3 className="font-semibold text-lg text-gray-800 mb-2">
//                 The largest photo gallery
//               </h3>
//               <p className="text-gray-500 text-sm">
//                 Explore the creativity of our members
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="text-center text-gray-500 py-6 text-sm border-t border-gray-200">
//         © 2025 PhotoChallenge. All rights reserved.
//       </footer>
//     </div>
//   );
// }
