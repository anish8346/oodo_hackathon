"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { MapPin, Plane } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const destinations = [
    { name: "Paris", delay: 0.1, yOffset: 10, xOffset: 20 },
    { name: "Tokyo", delay: 0.3, yOffset: -20, xOffset: -30 },
    { name: "Bali", delay: 0.5, yOffset: 30, xOffset: -10 },
    { name: "Dubai", delay: 0.7, yOffset: -10, xOffset: 40 },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      {/* Left Side: Hero Section (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          {/* Brand Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/80 via-[#38BDF8]/60 to-[#F97316]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Top Content: Brand */}
        <div className="relative z-10 p-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 text-white"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Traveloop</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 max-w-md text-lg font-medium text-white/90"
          >
            Your journey begins with a single step. Discover, plan, and experience the world effortlessly.
          </motion.p>
        </div>

        {/* Center Content: Floating Cards */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-12">
          <div className="relative h-64 w-full max-w-sm">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [dest.yOffset, dest.yOffset - 15, dest.yOffset],
                }}
                transition={{
                  opacity: { delay: dest.delay, duration: 0.5 },
                  scale: { delay: dest.delay, duration: 0.5 },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: dest.delay,
                  },
                }}
                className="absolute flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white shadow-xl backdrop-blur-md"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${50 + dest.xOffset}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <MapPin className="h-4 w-4 text-[#38BDF8]" />
                <span className="font-medium tracking-wide">{dest.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Content: Quote */}
        <div className="relative z-10 p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="border-l-4 border-[#F97316] pl-6"
          >
            <p className="text-xl font-medium italic leading-relaxed text-white">
              &ldquo;Travel is the only thing you buy that makes you richer.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-32 relative">
        {/* Mobile Background Elements */}
        <div className="absolute inset-0 -z-10 lg:hidden overflow-hidden pointer-events-none">
           <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#38BDF8]/10 blur-[100px]" />
           <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#2563EB]/10 blur-[100px]" />
        </div>
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="mb-10 flex flex-col items-center justify-center lg:hidden">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563EB] shadow-lg shadow-[#2563EB]/20">
            <Plane className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Traveloop</h1>
        </div>

        {/* Main Form Content */}
        {children}
      </div>
    </div>
  );
}
