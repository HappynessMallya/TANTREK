"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAP_BG = "#081F1A";
const ROUTE_GOLD = "#D4AF37";
const IVORY = "rgba(245, 240, 230, 0.5)";

/** Simplified Tanzania outline path (minimal illustrated style) */
const TANZANIA_PATH =
  "M 52 8 L 72 12 L 88 28 L 95 52 L 92 78 L 85 95 L 72 98 L 55 92 L 38 82 L 28 65 L 22 45 L 24 25 L 35 12 Z";

const DOTS = [
  { id: "dar", x: 88, y: 72, label: "Dar es Salaam" },
  { id: "julius", x: 78, y: 78, label: "Julius Nyerere" },
  { id: "serengeti", x: 48, y: 22, label: "Serengeti" },
  { id: "ngorongoro", x: 45, y: 35, label: "Ngorongoro" },
  { id: "ruaha", x: 55, y: 65, label: "Ruaha" },
  { id: "katavi", x: 32, y: 55, label: "Katavi" },
];

const ROUTES: { points: [number, number][]; label?: string }[] = [
  { points: [[88, 72], [78, 78]], label: "Dar → Julius Nyerere" },
  { points: [[52, 18], [48, 22], [45, 35]], label: "Northern circuit" },
  { points: [[55, 65]], label: "Southern" },
  { points: [[32, 55]], label: "Western" },
];

interface AnimatedTanzaniaMapProps {
  onComplete: () => void;
  isActive: boolean;
}

export function AnimatedTanzaniaMap({ onComplete, isActive }: AnimatedTanzaniaMapProps) {
  const [step, setStep] = useState<"outline" | "route1" | "route2" | "route3" | "route4" | "message">("outline");
  const [outlineVisible, setOutlineVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setStep("outline");
      setOutlineVisible(false);
      setMessageVisible(false);
      return;
    }
    setStep("outline");
    setOutlineVisible(false);
    setMessageVisible(false);
    const t1 = setTimeout(() => setOutlineVisible(true), 400);
    const t2 = setTimeout(() => setStep("route1"), 2200);
    const t3 = setTimeout(() => setStep("route2"), 5500);
    const t4 = setTimeout(() => setStep("route3"), 9000);
    const t5 = setTimeout(() => setStep("route4"), 12000);
    const t6 = setTimeout(() => setMessageVisible(true), 15500);
    const t7 = setTimeout(() => onComplete(), 20000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
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
          className="absolute inset-0 z-[5] flex items-center justify-center"
        >
          {/* Background image — kept subtle with dark overlay so map stays readable */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/land.jpg)" }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: MAP_BG, opacity: 0.92 }}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-2xl mx-auto px-8">
            <svg
              viewBox="0 0 120 110"
              className="w-full h-auto"
              style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.15))" }}
            >
              {/* Tanzania outline — ivory, subtle */}
              <motion.path
                d={TANZANIA_PATH}
                fill="none"
                stroke={IVORY}
                strokeWidth="0.8"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: outlineVisible ? 1 : 0,
                  opacity: outlineVisible ? 1 : 0,
                }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
              {/* Routes in gold — reveal by step */}
              {step >= "route1" && (
                <motion.line
                  x1={ROUTES[0].points[0][0]}
                  y1={ROUTES[0].points[0][1]}
                  x2={ROUTES[0].points[1][0]}
                  y2={ROUTES[0].points[1][1]}
                  stroke={ROUTE_GOLD}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                />
              )}
              {step >= "route2" && (
                <>
                  <motion.line
                    x1={52}
                    y1={18}
                    x2={48}
                    y2={22}
                    stroke={ROUTE_GOLD}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.line
                    x1={48}
                    y1={22}
                    x2={45}
                    y2={35}
                    stroke={ROUTE_GOLD}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </>
              )}
              {/* Dots with gold glow — show as routes appear */}
              {DOTS.map((dot, i) => {
                const show =
                  (step === "route1" && (dot.id === "dar" || dot.id === "julius")) ||
                  (step >= "route2" && (dot.id === "serengeti" || dot.id === "ngorongoro")) ||
                  (step >= "route3" && dot.id === "ruaha") ||
                  (step >= "route4" && dot.id === "katavi");
                if (!show) return null;
                return (
                  <g key={dot.id}>
                    <motion.circle
                      cx={dot.x}
                      cy={dot.y}
                      r="3.5"
                      fill={ROUTE_GOLD}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="map-dot-glow"
                      style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.9))" }}
                    />
                    <motion.text
                      x={dot.x}
                      y={dot.y - 6}
                      textAnchor="middle"
                      fill={IVORY}
                      fontSize="3.5"
                      fontFamily="system-ui, sans-serif"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {dot.label}
                    </motion.text>
                  </g>
                );
              })}
            </svg>

            <AnimatePresence>
              {messageVisible && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-display text-center text-xl sm:text-2xl text-[#D4AF37] mt-8 tracking-wide"
                >
                  Discover Tanzania&apos;s Untamed Frontiers
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
