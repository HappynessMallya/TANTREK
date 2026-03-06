"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTanzaniaMapProps {
  onComplete: () => void;
  isActive: boolean;
}

export function AnimatedTanzaniaMap({ onComplete, isActive }: AnimatedTanzaniaMapProps) {
  const [messageVisible, setMessageVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setMessageVisible(false);
      setVideoReady(false);
      setVideoError(false);
      return;
    }
    setMessageVisible(false);
    setVideoReady(false);
    setVideoError(false);
    setVideoKey((k) => k + 1); // fresh video element each time map phase is shown
    const t = setTimeout(() => setMessageVisible(true), 800);
    return () => clearTimeout(t);
  }, [isActive]);

  const onCanPlay = useCallback(() => {
    setVideoReady(true);
    setVideoError(false);
  }, []);

  const onVideoError = useCallback(() => {
    setVideoReady(false);
    setVideoError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setVideoError(false);
    setVideoReady(false);
    setVideoKey((k) => k + 1);
  }, []);

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
          {/* Map video — loading, error, or playing */}
          <div className="relative flex-1 min-h-0">
            {videoError && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#081F1A]">
                <div className="flex flex-col items-center gap-6 text-center px-6">
                  <p className="font-body text-sm text-safari-sand-light/90">Map video couldn&apos;t load. You can continue to the rest of the site.</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="px-4 py-2 font-body text-sm uppercase tracking-wider border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 transition-colors rounded"
                    >
                      Retry
                    </button>
                    <button
                      type="button"
                      onClick={onComplete}
                      className="px-4 py-2 font-body text-sm uppercase tracking-wider bg-luxury-gold text-safari-green-dark hover:opacity-90 transition-opacity rounded"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!videoReady && !videoError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#081F1A]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-luxury-gold/40 border-t-luxury-gold rounded-full animate-spin" aria-hidden />
                  <p className="font-body text-xs tracking-wider uppercase text-safari-sand-light/80">Loading map</p>
                </div>
              </div>
            )}
            <video
              key={videoKey}
              src="/map.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              onCanPlay={onCanPlay}
              onError={onVideoError}
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
