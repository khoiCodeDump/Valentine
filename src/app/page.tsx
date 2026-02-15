"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlowerSVG, { BouquetFlowerSVG } from "@/components/FlowerSVG";
import { FLOWERS, WATER_CLICKS_TO_GROW, GROW_STAGES, GrowStage, FlowerInfo } from "@/components/FlowerData";
import MusicPlayer from "@/components/MusicPlayer";
import Image from "next/image";

const ALBUM_PHOTOS = [
  "/images/IMG_6818.jpg",
  "/images/IMG_7622.jpg",
  "/images/IMG_8124.jpg",
  "/images/IMG_8225.jpg",
  "/images/IMG_8336.jpg",
  "/images/IMG_8383.jpg",
  "/images/IMG_8388.jpg",
  "/images/IMG_8434.jpg",
  "/images/IMG_8595.jpg",
  "/images/IMG_8713.jpg",
  "/images/IMG_8838.jpg",
  "/images/IMG_8892.jpg",
  "/images/IMG_9069.jpg",
  "/images/IMG_9161.jpg",
];

// Pre-computed positions to avoid Math.random() hydration mismatches
const PETAL_POSITIONS = [
  { left: 8, duration: 10, delay: 0.2 },
  { left: 22, duration: 12, delay: 1.5 },
  { left: 35, duration: 9, delay: 3.0 },
  { left: 48, duration: 13, delay: 0.8 },
  { left: 55, duration: 11, delay: 2.2 },
  { left: 67, duration: 8, delay: 4.1 },
  { left: 15, duration: 14, delay: 1.0 },
  { left: 78, duration: 10, delay: 3.5 },
  { left: 42, duration: 12, delay: 0.5 },
  { left: 88, duration: 9, delay: 2.8 },
  { left: 30, duration: 11, delay: 4.5 },
  { left: 72, duration: 13, delay: 1.8 },
];

const HEART_POSITIONS = [
  { left: 12, xDrift: -30, duration: 3.5, delay: 0.0 },
  { left: 25, xDrift: 20, duration: 4.0, delay: 0.3 },
  { left: 38, xDrift: -15, duration: 3.2, delay: 0.7 },
  { left: 50, xDrift: 40, duration: 4.5, delay: 1.0 },
  { left: 62, xDrift: -25, duration: 3.8, delay: 0.2 },
  { left: 75, xDrift: 10, duration: 4.2, delay: 1.4 },
  { left: 85, xDrift: -45, duration: 3.0, delay: 0.5 },
  { left: 18, xDrift: 35, duration: 4.8, delay: 1.8 },
  { left: 42, xDrift: -20, duration: 3.6, delay: 0.9 },
  { left: 58, xDrift: 30, duration: 4.1, delay: 1.2 },
  { left: 70, xDrift: -10, duration: 3.4, delay: 0.4 },
  { left: 32, xDrift: 25, duration: 4.6, delay: 1.6 },
  { left: 80, xDrift: -35, duration: 3.3, delay: 0.6 },
  { left: 48, xDrift: 15, duration: 4.3, delay: 1.1 },
  { left: 22, xDrift: -40, duration: 3.7, delay: 0.8 },
];

type Scene = "intro" | "garden" | "table" | "letter" | "finale";

interface FlowerState {
  waterCount: number;
  stage: GrowStage;
  collected: boolean;
  waterDrops: number[];
  showSparkle: boolean;
  showMessage: boolean;
}

export default function Home() {
  const [scene, setScene] = useState<Scene>("intro");
  const [flowers, setFlowers] = useState<FlowerState[]>(
    FLOWERS.map(() => ({
      waterCount: 0,
      stage: "seed" as GrowStage,
      collected: false,
      waterDrops: [],
      showSparkle: false,
      showMessage: false,
    }))
  );
  const [collectedFlowers, setCollectedFlowers] = useState<FlowerInfo[]>([]);
  const [letterOpen, setLetterOpen] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumPhoto, setAlbumPhoto] = useState(0);
  const [albumDir, setAlbumDir] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const dropIdRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const allBloomed = flowers.every((f) => f.stage === "blooming");
  const allCollected = flowers.every((f) => f.collected);

  const waterFlower = useCallback(
    (index: number) => {
      setFlowers((prev) => {
        const updated = [...prev];
        const flower = { ...updated[index] };

        if (flower.stage === "blooming") return prev;

        flower.waterCount += 1;
        flower.showSparkle = true;

        const newDropId = dropIdRef.current++;
        flower.waterDrops = [...flower.waterDrops, newDropId];

        // 1 click = bloom
        flower.stage = "blooming";
        flower.showMessage = true;

        updated[index] = flower;
        return updated;
      });

      // Clear sparkle after animation
      setTimeout(() => {
        setFlowers((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], showSparkle: false };
          return updated;
        });
      }, 1000);
    },
    []
  );

  const dismissMessage = useCallback((index: number) => {
    setFlowers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], showMessage: false };
      return updated;
    });
  }, []);

  const collectFlower = useCallback(
    (index: number) => {
      if (flowers[index].stage !== "blooming" || flowers[index].collected) return;

      setFlowers((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], collected: true };
        return updated;
      });
      setCollectedFlowers((prev) => [...prev, FLOWERS[index]]);
    },
    [flowers]
  );

  const handleNoClick = () => {
    setNoScale((prev) => Math.max(prev * 0.7, 0.1));
    setYesScale((prev) => Math.min(prev * 1.35, 8));
  };

  const handleYesClick = async () => {
    setAnswered(true);

    const confettiModule = await import("canvas-confetti");
    const confetti = confettiModule.default;

    const duration = 5000;
    const end = Date.now() + duration;
    const colors = ["#FF6B8A", "#FF8C42", "#AB47BC", "#42A5F5", "#EF5350", "#FFD700", "#FF69B4"];

    const frame = () => {
      confetti({ particleCount: 7, angle: 60, spread: 80, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 7, angle: 120, spread: 80, origin: { x: 1, y: 0.7 }, colors });
      confetti({ particleCount: 5, angle: 90, spread: 120, origin: { x: 0.5, y: 0.3 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => setShowHeart(true), 2000);
  };

  // Check if any flower message is showing
  const anyMessageShowing = flowers.some((f) => f.showMessage);

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Music Player */}
      <MusicPlayer
        src={scene === "intro" || scene === "garden" ? "/music/garden.mp3" : "/music/love.mp3"}
        label="Music"
        musicEnabled={musicEnabled}
        onToggle={() => setMusicEnabled((prev) => !prev)}
      />

      <AnimatePresence mode="wait">
        {/* ========== INTRO SCENE ========== */}
        {scene === "intro" && (
          <motion.div
            key="intro"
            className="w-full h-full flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 30%, #f48fb1 60%, #ec407a 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-center px-8"
            >
              <motion.div
                className="text-8xl md:text-9xl mb-8"
                style={{ animation: "heartbeat 2s ease-in-out infinite" }}
              >
                🌷
              </motion.div>
              <h1
                className="text-6xl md:text-8xl text-white mb-6 drop-shadow-lg"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  textShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                I Made You a Garden
              </h1>
              <p
                className="text-2xl md:text-3xl text-white mb-14 max-w-2xl mx-auto px-6 py-4 leading-relaxed"
                style={{
                  fontFamily: "'Lora', serif",
                  textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                }}
              >
                Every flower here blooms because of your love...
              </p>
              <motion.button
                onClick={() => setScene("garden")}
                className="bg-white/90 text-pink-600 rounded-full text-2xl md:text-3xl shadow-xl hover:bg-white hover:shadow-2xl transition-all font-semibold"
                style={{ fontFamily: "'Lora', serif", padding: "14px 36px" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Enter the Garden 🌿
              </motion.button>
            </motion.div>

            {/* Floating petals background */}
            {PETAL_POSITIONS.map((petal, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl pointer-events-none"
                style={{
                  left: `${petal.left}%`,
                  top: `-5%`,
                }}
                animate={{
                  y: ["0vh", "110vh"],
                  x: [0, Math.sin(i) * 100],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: petal.duration,
                  repeat: Infinity,
                  delay: petal.delay,
                  ease: "linear",
                }}
              >
                {["🌸", "💮", "🩷", "🪻"][i % 4]}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ========== GARDEN SCENE ========== */}
        {scene === "garden" && (
          <motion.div
            key="garden"
            className="w-full h-full relative watering-can-cursor"
            style={{
              background:
                "linear-gradient(180deg, #87CEEB 0%, #B2EBF2 35%, #E8F5E9 55%, #81C784 65%, #4CAF50 75%, #388E3C 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
          >
            {/* Sun */}
            <motion.div
              className="absolute top-6 right-8 w-24 h-24 md:w-28 md:h-28 rounded-full"
              style={{
                background: "radial-gradient(circle, #FFF176 30%, #FFEE58 60%, transparent 70%)",
                boxShadow: "0 0 80px rgba(255, 238, 88, 0.5)",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Clouds */}
            {[
              { left: "10%", top: "8%", size: 1.2 },
              { left: "60%", top: "5%", size: 1 },
              { left: "35%", top: "15%", size: 0.8 },
            ].map((cloud, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: cloud.left,
                  top: cloud.top,
                  transform: `scale(${cloud.size})`,
                }}
                animate={{ x: [0, 30, 0] }}
                transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="w-28 h-12 rounded-full bg-white/80"
                  style={{ boxShadow: "24px 6px 0 -2px rgba(255,255,255,0.8), -18px 4px 0 -3px rgba(255,255,255,0.8)" }}
                />
              </motion.div>
            ))}

            {/* Title / Instructions */}
            <motion.div
              className="absolute top-4 left-0 right-0 text-center z-10 px-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-block bg-black/25 backdrop-blur-sm rounded-2xl" style={{ padding: "16px 32px" }}>
                <h2
                  className="text-3xl md:text-5xl text-white font-bold"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    textShadow: "0 3px 15px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
                    fontWeight: 700,
                  }}
                >
                  {allBloomed && !allCollected
                    ? "Beautiful! Now collect your flowers 💐"
                    : allCollected
                    ? "All flowers collected! 🌸"
                    : "Click on each flower to water it 💧"}
                </h2>
              </div>
            </motion.div>

            {/* Garden ground */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%]">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <path d="M0,80 Q250,0 500,60 Q750,120 1000,40 L1000,400 L0,400 Z" fill="#5D4037" />
                <path d="M0,80 Q250,0 500,60 Q750,120 1000,40 L1000,45 Q750,125 500,65 Q250,5 0,85 Z" fill="#4E342E" opacity="0.3" />
              </svg>
            </div>

            {/* Flowers */}
            <div className="absolute bottom-[12%] left-0 right-0 flex justify-center items-end gap-3 md:gap-8 px-2 md:px-8">
              {FLOWERS.map((flowerInfo, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center relative"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  {/* Flower */}
                  <motion.div
                    className="relative cursor-pointer"
                    onClick={() => {
                      if (flowers[i].stage === "blooming" && !flowers[i].collected) {
                        // Toggle this flower's message only
                        setFlowers((prev) => {
                          const updated = [...prev];
                          updated[i] = { ...updated[i], showMessage: !updated[i].showMessage };
                          return updated;
                        });
                      } else if (flowers[i].stage !== "blooming") {
                        waterFlower(i);
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {flowers[i].collected ? (
                      <motion.div
                        className="flex items-center justify-center"
                        style={{ width: isMobile ? 140 : 200, height: isMobile ? 200 : 240 }}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0.4, scale: 0.9 }}
                      >
                        <span className="text-5xl md:text-6xl opacity-50">✨</span>
                      </motion.div>
                    ) : (
                      <FlowerSVG
                        flower={flowerInfo}
                        stage={flowers[i].stage}
                        waterDrops={flowers[i].waterDrops}
                        showSparkle={flowers[i].showSparkle}
                        size={isMobile ? 140 : 200}
                      />
                    )}
                  </motion.div>

                  {/* Love language label */}
                  <motion.div
                    className="mt-2 text-center"
                    style={{ width: isMobile ? 130 : 180 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                  >
                    <div className="text-2xl md:text-3xl mb-1">{flowerInfo.emoji}</div>
                    <p
                      className="text-xs md:text-sm text-white font-bold drop-shadow-lg leading-tight"
                      style={{
                        fontFamily: "'Lora', serif",
                        textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                    >
                      {flowerInfo.title}
                    </p>
                  </motion.div>

                  {/* Love language message popup */}
                  <AnimatePresence>
                    {flowers[i].showMessage && (
                      <motion.div
                        className="absolute z-30 left-1/2 -translate-x-1/2"
                        style={{ bottom: isMobile ? "85%" : "80%", width: isMobile ? 200 : 260 }}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50"
                          style={{ padding: "18px 22px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
                        >
                          <p
                            className="text-sm md:text-base font-semibold mb-2"
                            style={{
                              fontFamily: "'Dancing Script', cursive",
                              color: flowerInfo.color,
                              fontSize: isMobile ? "16px" : "18px",
                            }}
                          >
                            {flowerInfo.emoji} {flowerInfo.title}
                          </p>
                          <p
                            className="text-xs md:text-sm text-gray-700 leading-relaxed"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {flowerInfo.description}
                          </p>
                          {allBloomed && !flowers[i].collected && (
                            <button
                              className="block mx-auto mt-3 bg-pink-500 text-white rounded-full text-xs md:text-sm font-semibold hover:bg-pink-600 transition-colors cursor-pointer"
                              style={{ padding: "6px 20px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                collectFlower(i);
                                dismissMessage(i);
                              }}
                            >
                              Collect 🌸
                            </button>
                          )}
                        </div>
                        {/* Arrow pointing down */}
                        <div
                          className="w-4 h-4 bg-white/95 rotate-45 mx-auto -mt-2"
                          style={{ boxShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Collected counter */}
            {allBloomed && !allCollected && (
              <motion.div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                style={{ padding: "10px 28px" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <p className="text-base md:text-lg text-pink-600 font-semibold" style={{ fontFamily: "'Lora', serif" }}>
                  💐 Collected: {collectedFlowers.length} / {FLOWERS.length}
                </p>
              </motion.div>
            )}

            {/* Continue button after all collected */}
            {allCollected && (
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
                initial={{ y: 30, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.3 }}
              >
                <motion.button
                  onClick={() => setScene("table")}
                  className="bg-pink-500 text-white rounded-full text-xl md:text-2xl shadow-xl hover:bg-pink-600 transition-colors font-semibold"
                  style={{
                    padding: "14px 36px",
                    fontFamily: "'Lora', serif",
                    boxShadow: "0 8px 30px rgba(236, 64, 122, 0.4)",
                  }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Continue →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ========== TABLE SCENE ========== */}
        {(scene === "table" || scene === "letter" || scene === "finale") && (
          <motion.div
            key="table"
            className="w-full h-full relative"
            style={{
              background:
                "linear-gradient(180deg, #2C1810 0%, #3E2723 20%, #4E342E 40%, #5D4037 60%, #6D4C41 80%, #795548 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Warm ambient light */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-25"
              style={{
                background: "radial-gradient(ellipse, #FFE0B2 0%, transparent 70%)",
              }}
            />

            {/* Table surface - lowered 30% */}
            <div className="absolute bottom-0 left-0 right-0 h-[38%]">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 380">
                <path d="M50,80 L950,80 L850,0 L150,0 Z" fill="#8D6E63" />
                <path d="M50,80 L950,80 L850,0 L150,0 Z" fill="url(#woodGrain)" opacity="0.3" />
                <path d="M50,80 L950,80 L950,380 L50,380 Z" fill="#6D4C41" />
                <path d="M50,80 L950,80 L950,90 L50,90 Z" fill="#5D4037" />
                <defs>
                  <pattern id="woodGrain" width="200" height="10" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="5" x2="200" y2="5" stroke="#795548" strokeWidth="0.5" opacity="0.4" />
                    <line x1="0" y1="2" x2="200" y2="3" stroke="#795548" strokeWidth="0.3" opacity="0.3" />
                    <line x1="0" y1="8" x2="200" y2="7" stroke="#795548" strokeWidth="0.3" opacity="0.3" />
                  </pattern>
                </defs>
              </svg>
            </div>

            {/* Table cloth / runner */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-[80%] max-w-[700px] h-5 rounded-sm"
              style={{
                bottom: "31%",
                background: "linear-gradient(90deg, transparent 5%, #D32F2F 10%, #D32F2F 90%, transparent 95%)",
                opacity: 0.4,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />

            {/* Jar with bouquet */}
            <motion.div
              className="absolute left-[25%] md:left-[35%] -translate-x-1/2"
              style={{ bottom: "30%" }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <div className="relative" style={{ width: 200, height: 280 }}>
                {/* Bouquet of flowers - on top of jar, stems go into the jar */}
                <div
                  className="absolute"
                  style={{
                    left: "30%",
                    transform: "translateX(-50%)",
                    bottom: "135px",
                    width: "200px",
                    height: "180px",
                    zIndex: 2,
                  }}
                >
                  {collectedFlowers.map((f, i) => {
                    const rotations = [-25, -12, 0, 12, 25];
                    const xOffsets = [-36, -18, 0, 18, 36];
                    const heights = [100, 115, 125, 115, 100];
                    return (
                      <motion.div
                        key={f.id}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${xOffsets[i] || 0}px)`,
                          bottom: 0,
                          transform: `translateX(-50%) rotate(${rotations[i] || 0}deg)`,
                          transformOrigin: "bottom center",
                          zIndex: i === 2 ? 5 : i === 1 || i === 3 ? 3 : 1,
                        }}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1 + i * 0.2, type: "spring" }}
                      >
                        <BouquetFlowerSVG flower={f} stemHeight={heights[i] || 120} />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Jar SVG */}
                <svg
                  width="200"
                  height="260"
                  viewBox="0 0 200 260"
                  className="absolute bottom-0 left-0"
                  style={{ zIndex: 1, overflow: "visible" }}
                >
                  {/* Jar body - back half (behind flowers) */}
                  <path
                    d="M45,80 L38,220 Q38,250 100,250 Q162,250 162,220 L155,80 Z"
                    fill="rgba(200, 230, 255, 0.18)"
                    stroke="rgba(150, 200, 240, 0.4)"
                    strokeWidth="2.5"
                  />
                  {/* Jar neck */}
                  <path
                    d="M58,55 L45,80 L155,80 L142,55 Z"
                    fill="rgba(200, 230, 255, 0.22)"
                    stroke="rgba(150, 200, 240, 0.4)"
                    strokeWidth="2.5"
                  />
                  {/* Water in jar */}
                  <path
                    d="M47,130 L40,220 Q40,248 100,248 Q160,248 160,220 L153,130 Z"
                    fill="rgba(100, 200, 255, 0.1)"
                  />
                  {/* Glass reflection */}
                  <path
                    d="M55,85 L50,210 Q50,220 58,220 L55,85"
                    fill="rgba(255,255,255,0.1)"
                  />
                  {/* Jar rim - on top of everything */}
                  <ellipse cx="100" cy="55" rx="42" ry="8" fill="rgba(200, 230, 255, 0.3)" stroke="rgba(150, 200, 240, 0.5)" strokeWidth="2.5" />
                </svg>

                {/* Jar label */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 bg-amber-50/80 rounded-lg text-center"
                  style={{ padding: "8px 20px", bottom: "15px", zIndex: 3 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <p
                    className="text-sm text-amber-800"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    Our Love 💕
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Photo Album book on table */}
            {scene === "table" && !letterOpen && (
              <motion.div
                className="absolute -translate-x-1/2 cursor-pointer"
                style={{ bottom: "32%", left: "50%" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.8, scale: { duration: 0.1 } }}
                whileHover={{ scale: 1.08, rotate: 0, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAlbumOpen(true)}
              >
                <div className="relative">
                  <svg width="200" height="150" viewBox="0 0 200 150">
                    <rect x="12" y="18" width="180" height="128" rx="4" fill="rgba(0,0,0,0.2)" />
                    <rect x="8" y="12" width="180" height="128" rx="4" fill="#7B1E3A" stroke="#5E1630" strokeWidth="1.5" />
                    <rect x="5" y="8" width="180" height="128" rx="4" fill="#9B2D50" stroke="#7B1E3A" strokeWidth="2" />
                    <rect x="15" y="18" width="160" height="108" rx="3" fill="none" stroke="#C4617A" strokeWidth="1" strokeDasharray="4 3" />
                    <rect x="22" y="25" width="146" height="94" rx="2" fill="#f5e6c8" opacity="0.15" />
                    <text x="95" y="58" textAnchor="middle" fontSize="16" fill="#F5D0D8" fontFamily="'Dancing Script', cursive" fontWeight="bold">Our Memories</text>
                    <text x="95" y="85" textAnchor="middle" fontSize="26">💕</text>
                    <line x1="8" y1="14" x2="8" y2="138" stroke="#5E1630" strokeWidth="3" />
                    <line x1="11" y1="14" x2="11" y2="138" stroke="#6B1840" strokeWidth="1" opacity="0.5" />
                    <line x1="10" y1="10" x2="183" y2="10" stroke="#f5e6c8" strokeWidth="1.5" opacity="0.6" />
                    <line x1="10" y1="12" x2="183" y2="12" stroke="#efe0c4" strokeWidth="1" opacity="0.4" />
                  </svg>
                  <motion.p
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-amber-200 text-base whitespace-nowrap font-semibold"
                    style={{ fontFamily: "'Lora', serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Click to open 📸
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Letter / Envelope */}
            {!letterOpen && scene === "table" && (
              <motion.div
                className="absolute cursor-pointer"
                style={{ bottom: "32%", right: isMobile ? "10%" : "25%" }}
                initial={{ y: 20, opacity: 0, rotate: -5 }}
                animate={{ y: 0, opacity: 1, rotate: -5, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8, scale: { duration: 0.1 }, rotate: { duration: 0.15 } }}
                whileHover={{ scale: 1.08, rotate: 0, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLetterOpen(true);
                  setScene("letter");
                }}
              >
                <div className="relative">
                  {/* Bigger envelope */}
                  <svg width="220" height="150" viewBox="0 0 220 150">
                    <rect x="5" y="25" width="210" height="120" rx="5" fill="#f5e6c8" stroke="#d4c4a8" strokeWidth="2.5" />
                    <path d="M5,25 L110,85 L215,25" fill="#efe0c4" stroke="#d4c4a8" strokeWidth="2.5" />
                    <text x="97" y="70" fontSize="28">💌</text>
                  </svg>
                  <motion.p
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-amber-200 text-base whitespace-nowrap font-semibold"
                    style={{
                      fontFamily: "'Lora', serif",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Click to open ✉️
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Letter content overlay */}
            <AnimatePresence>
              {(scene === "letter" || scene === "finale") && (
                <motion.div
                  className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="relative w-full max-w-3xl mx-auto"
                    initial={{ scale: 0.8, opacity: 0, rotateX: 30 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  >
                    {/* Parchment paper - much larger with generous padding */}
                    <div
                      className="rounded-xl shadow-2xl relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 50%, #efe0c4 100%)",
                        boxShadow: "0 25px 70px rgba(0,0,0,0.35), inset 0 0 40px rgba(0,0,0,0.04)",
                        padding: isMobile ? "36px 30px" : "50px 65px",
                      }}
                    >
                      {/* Paper texture lines */}
                      <div className="absolute inset-0 opacity-5">
                        {[...Array(25)].map((_, i) => (
                          <div key={i} className="w-full h-px bg-amber-900 mt-8" />
                        ))}
                      </div>

                      {!answered ? (
                        <div className="relative z-10 text-center">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <p
                              className="text-4xl md:text-5xl text-amber-900 mb-8"
                              style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                              My Dearest,
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                          >
                            <p
                              className="text-lg md:text-xl text-amber-800 mb-10 leading-loose max-w-2xl mx-auto"
                              style={{ fontFamily: "'Lora', serif" }}
                            >
                              Each flower in this garden grew from a seed of our love.
                              You water my heart every single day with your kindness,
                              your warmth, and just being you.
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                          >
                            <p
                              className="text-4xl md:text-5xl text-pink-600 mb-12"
                              style={{ fontFamily: "'Dancing Script', cursive" }}
                            >
                              Will you be my Valentine? 💕
                            </p>
                          </motion.div>

                          <motion.div
                            className="flex items-center justify-center gap-8 flex-wrap"
                            style={{ marginTop: "24px" }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 }}
                          >
                            <motion.button
                              onClick={handleYesClick}
                              className="bg-pink-500 text-white text-2xl rounded-full shadow-lg hover:bg-pink-600 transition-colors origin-center font-semibold"
                              style={{
                                fontFamily: "'Lora', serif",
                                zIndex: 10,
                                padding: "14px 32px",
                              }}
                              animate={{ scale: Math.min(yesScale, 5) }}
                              whileHover={{ scale: Math.min(yesScale, 5) * 1.1 }}
                              whileTap={{ scale: Math.min(yesScale, 5) * 0.95 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                              Yes! 💖
                            </motion.button>

                            <motion.button
                              onClick={handleNoClick}
                              className="bg-gray-300 text-gray-600 text-xl rounded-full shadow hover:bg-gray-400 transition-colors"
                              style={{ fontFamily: "'Lora', serif", padding: "10px 24px" }}
                              animate={{
                                scale: noScale,
                                opacity: Math.max(noScale, 0.15),
                              }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                              No
                            </motion.button>
                          </motion.div>
                        </div>
                      ) : (
                        <motion.div
                          className="relative z-10 text-center py-6"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                        >
                          <motion.div
                            className="text-7xl md:text-9xl mb-8"
                            style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}
                          >
                            💖
                          </motion.div>
                          <h2
                            className="text-5xl md:text-7xl text-pink-600 mb-8"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                          >
                            You said YES!
                          </h2>
                          <p
                            className="text-2xl md:text-3xl text-amber-800 mb-4"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            You just made me the happiest person in the world.
                          </p>
                          <p
                            className="text-xl md:text-2xl text-amber-700"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            Happy Valentine&apos;s Day, my love. 🌹
                          </p>

                          {/* Floating hearts */}
                          {showHeart && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                              {HEART_POSITIONS.map((heart, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute text-3xl"
                                  style={{
                                    left: `${heart.left}%`,
                                    bottom: "-10%",
                                  }}
                                  animate={{
                                    y: [0, -600],
                                    opacity: [1, 0],
                                    x: [0, heart.xDrift],
                                  }}
                                  transition={{
                                    duration: heart.duration,
                                    repeat: Infinity,
                                    delay: heart.delay,
                                    ease: "easeOut",
                                  }}
                                >
                                  {["❤️", "💕", "💖", "💗", "🩷"][i % 5]}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Decorative corners */}
                      <div className="absolute top-5 left-5 text-amber-300/30 text-3xl">❦</div>
                      <div className="absolute top-5 right-5 text-amber-300/30 text-3xl transform scale-x-[-1]">❦</div>
                      <div className="absolute bottom-5 left-5 text-amber-300/30 text-3xl transform scale-y-[-1]">❦</div>
                      <div className="absolute bottom-5 right-5 text-amber-300/30 text-3xl transform scale-[-1]">❦</div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Album slideshow overlay — exact same structure as letter */}
            <AnimatePresence>
              {albumOpen && (
                <motion.div
                  className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="relative w-full max-w-3xl mx-auto"
                    initial={{ scale: 0.8, opacity: 0, rotateX: 30 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  >
                    {/* Album container — matching SVG book color */}
                    <div
                      className="rounded-xl shadow-2xl relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #8B2252 0%, #9B2D50 50%, #8B2252 100%)",
                        boxShadow: "0 25px 70px rgba(0,0,0,0.35), inset 0 0 40px rgba(0,0,0,0.06)",
                        padding: isMobile ? "36px 30px" : "50px 65px",
                      }}
                    >

                      <div className="relative z-10 text-center">
                        {/* Title */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p
                            className="text-4xl md:text-5xl mb-8"
                            style={{ fontFamily: "'Dancing Script', cursive", color: "#F5D0D8", marginBottom: "24px" }}
                          >
                            Our Memories 💕
                          </p>
                        </motion.div>

                        {/* Photo — same area where letter text goes */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <div
                            className="relative mx-auto rounded-lg overflow-hidden"
                            style={{
                              width: "100%",
                              height: isMobile ? "40vh" : "50vh",
                              background: "#9B2D50",
                              border: "3px solid #C4617A",
                              boxShadow: "inset 0 0 15px rgba(0,0,0,0.3)",
                            }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={albumPhoto}
                                className="absolute inset-0"
                                initial={{ opacity: 0, x: albumDir * 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: albumDir * -60 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Image
                                  src={ALBUM_PHOTOS[albumPhoto]}
                                  alt={`Photo ${albumPhoto + 1}`}
                                  fill
                                  style={{ objectFit: "contain" }}
                                  sizes="(max-width: 768px) 100vw, 768px"
                                  priority
                                />
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </motion.div>

                        {/* Navigation */}
                        <motion.div
                          className="flex items-center justify-between"
                          style={{ marginTop: "24px" }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 }}
                        >
                          <button
                            onClick={() => { setAlbumDir(-1); setAlbumPhoto((p) => (p - 1 + ALBUM_PHOTOS.length) % ALBUM_PHOTOS.length); }}
                            className="rounded-full transition-colors cursor-pointer font-semibold"
                            style={{ padding: "10px 22px", fontSize: "16px", fontFamily: "'Lora', serif", background: "rgba(255,255,255,0.15)", color: "#F5D0D8" }}
                          >
                            ← Prev
                          </button>
                          <p
                            style={{ fontFamily: "'Lora', serif", fontSize: "16px", color: "#F5D0D8" }}
                          >
                            {albumPhoto + 1} / {ALBUM_PHOTOS.length}
                          </p>
                          <button
                            onClick={() => { setAlbumDir(1); setAlbumPhoto((p) => (p + 1) % ALBUM_PHOTOS.length); }}
                            className="rounded-full transition-colors cursor-pointer font-semibold"
                            style={{ padding: "10px 22px", fontSize: "16px", fontFamily: "'Lora', serif", background: "rgba(255,255,255,0.15)", color: "#F5D0D8" }}
                          >
                            Next →
                          </button>
                        </motion.div>

                        {/* Close */}
                        <motion.div
                          style={{ marginTop: "16px" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          <button
                            onClick={() => setAlbumOpen(false)}
                            className="transition-colors cursor-pointer font-semibold"
                            style={{ padding: "8px 24px", fontSize: "15px", fontFamily: "'Lora', serif", color: "#F5D0D8", background: "none", border: "none" }}
                          >
                            ✕ Close Album
                          </button>
                        </motion.div>
                      </div>

                      {/* Decorative corners */}
                      <div className="absolute top-5 left-5 text-3xl" style={{ color: "rgba(245,208,216,0.25)" }}>❦</div>
                      <div className="absolute top-5 right-5 text-3xl transform scale-x-[-1]" style={{ color: "rgba(245,208,216,0.25)" }}>❦</div>
                      <div className="absolute bottom-5 left-5 text-3xl transform scale-y-[-1]" style={{ color: "rgba(245,208,216,0.25)" }}>❦</div>
                      <div className="absolute bottom-5 right-5 text-3xl transform scale-[-1]" style={{ color: "rgba(245,208,216,0.25)" }}>❦</div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Candle */}
            <motion.div
              className="absolute"
              style={{ bottom: "33%", left: isMobile ? "12%" : "22%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <svg width="40" height="80" viewBox="0 0 40 80">
                <rect x="10" y="32" width="20" height="48" rx="3" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
                <line x1="20" y1="32" x2="20" y2="22" stroke="#333" strokeWidth="2" />
                <motion.ellipse
                  cx="20"
                  cy="17"
                  rx="7"
                  ry="11"
                  fill="#FF9800"
                  opacity={0.9}
                  animate={{ scaleY: [1, 1.15, 0.95, 1.1, 1], scaleX: [1, 0.9, 1.05, 0.95, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.ellipse
                  cx="20"
                  cy="17"
                  rx="4"
                  ry="7"
                  fill="#FFC107"
                  animate={{ scaleY: [1, 1.1, 0.9, 1], scaleX: [1, 0.9, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <circle cx="20" cy="17" r="20" fill="#FF9800" opacity="0.08" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
