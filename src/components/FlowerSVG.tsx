"use client";

import { motion } from "framer-motion";
import { FlowerInfo, GrowStage } from "./FlowerData";

interface FlowerSVGProps {
  flower: FlowerInfo;
  stage: GrowStage;
  waterDrops: number[];
  showSparkle: boolean;
  size?: number;
}

export default function FlowerSVG({
  flower,
  stage,
  waterDrops,
  showSparkle,
  size = 200,
}: FlowerSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ overflow: "visible" }}
    >
      {/* Water drops */}
      {waterDrops.map((id) => (
        <motion.circle
          key={id}
          cx={95 + (id % 5) * 2}
          cy={60}
          r={3}
          fill="var(--color-water)"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
        />
      ))}

      {/* Soil mound */}
      <ellipse cx="100" cy="180" rx="45" ry="12" fill="var(--color-soil)" />
      <ellipse cx="100" cy="178" rx="42" ry="10" fill="var(--color-soil-dark)" opacity="0.3" />

      {/* Seed stage */}
      {stage === "seed" && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <ellipse cx="100" cy="172" rx="8" ry="5" fill="#8B6914" />
          <ellipse cx="100" cy="171" rx="5" ry="3" fill="#A0782C" />
        </motion.g>
      )}

      {/* Blooming stage */}
      {stage === "blooming" && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Stem */}
          <line
            x1="100"
            y1="175"
            x2="100"
            y2="85"
            stroke={flower.leafColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <path
            d="M100,155 Q120,138 116,120 Q100,132 100,155"
            fill={flower.leafColor}
          />
          <path
            d="M100,140 Q80,123 84,105 Q100,117 100,140"
            fill="#5a9c69"
          />
          <path
            d="M100,125 Q116,112 113,98 Q100,108 100,125"
            fill={flower.leafColor}
          />

          {/* Flower head */}
          <motion.g
            style={{ animation: "sway 4s ease-in-out infinite" }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            {/* Petals */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const px = 100 + Math.cos(angle) * 18;
              const py = 68 + Math.sin(angle) * 18;
              return (
                <motion.ellipse
                  key={i}
                  cx={px}
                  cy={py}
                  rx="14"
                  ry="10"
                  fill={flower.petalColor}
                  opacity={0.85}
                  transform={`rotate(${i * 45} ${px} ${py})`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                />
              );
            })}
            {/* Center */}
            <circle cx="100" cy="68" r="10" fill={flower.centerColor} />
            <circle cx="100" cy="68" r="7" fill={flower.centerColor} opacity="0.7" />
            {/* Center dots */}
            {[0, 1, 2, 3, 4].map((i) => {
              const a = (i * 72 * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={100 + Math.cos(a) * 4}
                  cy={68 + Math.sin(a) * 4}
                  r="1.5"
                  fill="rgba(0,0,0,0.15)"
                />
              );
            })}
          </motion.g>

          {/* Glow effect for bloomed flower */}
          <motion.circle
            cx="100"
            cy="68"
            r="35"
            fill="none"
            stroke={flower.petalColor}
            strokeWidth="1"
            opacity={0.3}
            style={{ animation: "glowPulse 2s ease-in-out infinite" }}
          />
        </motion.g>
      )}

      {/* Sparkle effects when watering */}
      {showSparkle && (
        <>
          {[
            { x: 80, y: 100, delay: 0 },
            { x: 120, y: 90, delay: 0.2 },
            { x: 90, y: 80, delay: 0.4 },
            { x: 110, y: 110, delay: 0.1 },
          ].map((s, i) => (
            <motion.text
              key={i}
              x={s.x}
              y={s.y}
              fontSize="10"
              initial={{ opacity: 0, scale: 0, y: s.y }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: s.y - 20 }}
              transition={{ delay: s.delay, duration: 0.8 }}
            >
              ✨
            </motion.text>
          ))}
        </>
      )}
    </svg>
  );
}

/* Bouquet flower for jar display - much bigger */
export function BouquetFlowerSVG({
  flower,
  stemHeight = 120,
}: {
  flower: FlowerInfo;
  stemHeight?: number;
}) {
  const headY = 30;
  const stemBottom = headY + stemHeight;

  return (
    <svg
      width="80"
      height={stemHeight + 50}
      viewBox={`0 0 80 ${stemHeight + 50}`}
      style={{ overflow: "visible" }}
    >
      {/* Stem */}
      <line
        x1="40"
        y1={stemBottom}
        x2="40"
        y2={headY + 10}
        stroke={flower.leafColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Leaves on stem */}
      <path
        d={`M40,${headY + 50} Q52,${headY + 40} 50,${headY + 30} Q40,${headY + 38} 40,${headY + 50}`}
        fill={flower.leafColor}
      />
      <path
        d={`M40,${headY + 70} Q28,${headY + 60} 30,${headY + 50} Q40,${headY + 58} 40,${headY + 70}`}
        fill="#5a9c69"
      />
      {/* Petals */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const px = 40 + Math.cos(angle) * 14;
        const py = headY + Math.sin(angle) * 14;
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx="11"
            ry="8"
            fill={flower.petalColor}
            opacity={0.9}
            transform={`rotate(${i * 45} ${px} ${py})`}
          />
        );
      })}
      <circle cx="40" cy={headY} r="8" fill={flower.centerColor} />
      <circle cx="40" cy={headY} r="5" fill={flower.centerColor} opacity="0.7" />
    </svg>
  );
}
