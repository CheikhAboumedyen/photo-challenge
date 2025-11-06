"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "lucide-react";

const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gray-50 text-gray-900 overflow-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex justify-end items-center px-8 py-4 z-50 mb-7">
        <ul className="flex space-x-6">
          <li>
            <a href="#">About</a>
          </li>
          <li>Lang</li>
          <li>
            <Button
              asChild
              variant="outline"
              className="cursor-pointer"
              size="sm"
            >
              <a href="/login">Login</a>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant="outline"
              className="cursor-pointer"
              size="sm"
            >
              <a href="/signup">Signup</a>
            </Button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-8 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl lg:text-6xl font-bold mb-4 mt-9"
        >
          Join the Photo Community
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg lg:text-xl mb-12 max-w-xl"
        >
          Explore amazing photography and challenge yourself with our monthly
          themes.
        </motion.p>

        {/* Animated Images */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex space-x-4 w-max will-change-transform"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
              delay: 1,
            }}
          >
            {images.concat(images).map((src, index) => (
              <div
                key={index}
                className="shrink-0 w-48 h-32 rounded-lg overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex space-x-4"
        >
          <button className="px-6 py-3 bg-gray-700 text-white border  border-gray-700 rounded-lg hover:bg-gray-800 transition cursor-pointer">
            Get Started
          </button>
          <button className="px-6 py-3 border border-gray-700 rounded-lg  hover:bg-gray-200 transition cursor-pointer">
            Learn More
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-500">
        &copy; 2025 PhotoChallenge
      </footer>
    </div>
  );
}
