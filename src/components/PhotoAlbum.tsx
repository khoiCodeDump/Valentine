"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PHOTOS = [
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

interface PhotoAlbumProps {
  isMobile: boolean;
}

export default function PhotoAlbum({ isMobile }: PhotoAlbumProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % PHOTOS.length);
  };
  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  };

  return (
    <>
      {/* Album on table - SVG book matching the envelope style */}
      <motion.div
        className="cursor-pointer"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08, rotate: 0 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <svg width="200" height="150" viewBox="0 0 200 150">
            <rect x="12" y="18" width="180" height="128" rx="4" fill="rgba(0,0,0,0.2)" />
            <rect x="8" y="12" width="180" height="128" rx="4" fill="#7B1E3A" stroke="#5E1630" strokeWidth="1.5" />
            <rect x="5" y="8" width="180" height="128" rx="4" fill="#9B2D50" stroke="#7B1E3A" strokeWidth="2" />
            <rect x="15" y="18" width="160" height="108" rx="3" fill="none" stroke="#C4617A" strokeWidth="1" strokeDasharray="4 3" />
            <rect x="22" y="25" width="146" height="94" rx="2" fill="#f5e6c8" opacity="0.15" />
            <text x="95" y="58" textAnchor="middle" fontSize="16" fill="#F5D0D8" fontFamily="'Dancing Script', cursive" fontWeight="bold">
              Our Memories
            </text>
            <text x="95" y="85" textAnchor="middle" fontSize="26">💕</text>
            <line x1="8" y1="14" x2="8" y2="138" stroke="#5E1630" strokeWidth="3" />
            <line x1="11" y1="14" x2="11" y2="138" stroke="#6B1840" strokeWidth="1" opacity="0.5" />
            <line x1="10" y1="10" x2="183" y2="10" stroke="#f5e6c8" strokeWidth="1.5" opacity="0.6" />
            <line x1="10" y1="12" x2="183" y2="12" stroke="#efe0c4" strokeWidth="1" opacity="0.4" />
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
            Click to open 📸
          </motion.p>
        </div>
      </motion.div>

      {/* Slideshow overlay — rendered via portal-like fixed positioning to escape parent constraints */}
      <AnimatePresence>
        {open && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              padding: isMobile ? "16px" : "32px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "768px",
              }}
              initial={{ scale: 0.8, opacity: 0, rotateX: 30 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Parchment frame — same as letter */}
              <div
                style={{
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 50%, #efe0c4 100%)",
                  boxShadow: "0 25px 70px rgba(0,0,0,0.35), inset 0 0 40px rgba(0,0,0,0.04)",
                  padding: isMobile ? "36px 30px" : "50px 65px",
                }}
              >
                {/* Paper texture lines */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.05 }}>
                  {[...Array(25)].map((_, i) => (
                    <div key={i} style={{ width: "100%", height: "1px", background: "#78350f", marginTop: "32px" }} />
                  ))}
                </div>

                <div style={{ position: "relative", zIndex: 10 }}>
                  {/* Title */}
                  <motion.p
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: isMobile ? "28px" : "36px",
                      color: "#78350f",
                      marginBottom: "24px",
                      textAlign: "center",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Our Memories 💕
                  </motion.p>

                  {/* Photo container — explicit height so Image fill works */}
                  <motion.div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: isMobile ? "50vh" : "60vh",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "#2C1810",
                      boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
                      border: "3px solid #d4c4a8",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={current}
                        style={{ position: "absolute", inset: 0 }}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -80 }}
                        transition={{ duration: 0.35 }}
                      >
                        <Image
                          src={PHOTOS[current]}
                          alt={`Photo ${current + 1}`}
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="(max-width: 768px) 100vw, 768px"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  {/* Controls */}
                  <motion.div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "20px",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={goPrev}
                      style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        fontFamily: "'Lora', serif",
                        background: "rgba(120, 53, 15, 0.15)",
                        color: "#78350f",
                        borderRadius: "9999px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      ← Prev
                    </button>

                    <p
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: "16px",
                        color: "#92400e",
                      }}
                    >
                      {current + 1} / {PHOTOS.length}
                    </p>

                    <button
                      onClick={goNext}
                      style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        fontFamily: "'Lora', serif",
                        background: "rgba(120, 53, 15, 0.15)",
                        color: "#78350f",
                        borderRadius: "9999px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Next →
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  top: "-36px",
                  right: "4px",
                  padding: "4px 12px",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "24px",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✕ Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
