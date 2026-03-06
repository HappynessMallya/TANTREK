"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAP_DISPLAY_DURATION_MS = 20000;

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
    const t1 = setTimeout(() => setMessageVisible(true), 800);
    const t2 = setTimeout(() => onComplete(), MAP_DISPLAY_DURATION_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-[5] flex flex-col items-center justify-center bg-[#081F1A]"
        >
          <div className="absolute inset-0">
            <video
              src="/map.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="Tanzania safari map"
            />
          </div>
          <AnimatePresence>
            {messageVisible && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative z-10 font-display text-center text-xl sm:text-2xl text-[#D4AF37] pb-12 sm:pb-16 tracking-wide"
              >
              
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
