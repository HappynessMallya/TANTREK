"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTanzaniaMapProps {
  onComplete: () => void;
  isActive: boolean;
}

export function AnimatedTanzaniaMap({ onComplete, isActive }: AnimatedTanzaniaMapProps) {
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setMessageVisible(false);
      return;
    }
    setMessageVisible(false);
    const t = setTimeout(() => setMessageVisible(true), 800);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-[5] flex flex-col bg-[#081F1A]"
        >
          {/* Header at top — not over the map */}
          <AnimatePresence>
            {messageVisible && (
              <motion.h2
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative z-10 font-display text-center text-xl sm:text-2xl lg:text-3xl text-[#D4AF37] pt-24 sm:pt-28 pb-6 tracking-wide"
              >
                Discover Tanzania&apos;s Untamed Frontiers
              </motion.h2>
            )}
          </AnimatePresence>
          {/* Map video — no overlay, clean display */}
          <div className="relative flex-1 min-h-0">
            <video
              src="/map.mp4"
              autoPlay
              muted
              playsInline
              onEnded={onComplete}
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="Tanzania safari map"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
