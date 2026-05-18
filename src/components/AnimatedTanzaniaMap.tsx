"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isActive) {
      setMessageVisible(false);
      videoRef.current?.pause();
      return;
    }
    setMessageVisible(false);
    const t = setTimeout(() => setMessageVisible(true), 800);
    if (videoRef.current && videoRef.current.readyState >= 3) setVideoReady(true);
    videoRef.current?.play().catch(() => {});
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
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
        visibility: isActive ? "visible" : "hidden",
      }}
      transition={{ duration: isActive ? 1.2 : 0.4, ease: "easeOut" }}
      className="absolute inset-0 z-[5] flex flex-col bg-tantrek-navy-deep"
      aria-hidden={!isActive}
    >
      {/* Brand teal glow accent */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,122,0,0.15), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Header */}
      <AnimatePresence>
        {messageVisible && isActive && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center pt-24 sm:pt-28 pb-6 px-4"
          >
            <p className="font-body text-tantrek-orange text-[11px] font-bold tracking-[0.32em] uppercase mb-3">
              Where We Operate
            </p>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
              Tanzania in <span className="text-tantrek-orange">360°</span>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex-1 min-h-0 min-w-0">
        {videoError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-tantrek-navy-deep">
            <div className="flex flex-col items-center gap-6 text-center px-6">
              <p className="font-body text-sm text-white/90 max-w-sm">
                Map video couldn&apos;t load. You can continue to the rest of the site.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-wider rounded-full border-2 border-white/40 text-white hover:bg-white hover:text-tantrek-navy-deep hover:border-white transition-all"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={onComplete}
                  className="px-5 py-2.5 font-body text-sm font-semibold uppercase tracking-wider rounded-full bg-tantrek-orange text-white shadow-[0_8px_20px_rgba(255,122,0,0.32)] hover:bg-tantrek-orange-deep transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
        {!videoReady && !videoError && isActive && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-tantrek-navy-deep">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-10 h-10 border-2 border-tantrek-orange/35 border-t-tantrek-orange rounded-full animate-spin"
                aria-hidden
              />
              <p className="font-body text-xs tracking-[0.28em] uppercase text-white/80 font-semibold">
                Loading map
              </p>
            </div>
          </div>
        )}
        <video
          key={videoKey}
          ref={videoRef}
          src="/map.mp4"
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
  );
}
