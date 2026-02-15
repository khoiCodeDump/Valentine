"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface MusicPlayerProps {
  src: string;
  label: string;
  musicEnabled: boolean;
  onToggle: () => void;
}

export default function MusicPlayer({ src, label, musicEnabled, onToggle }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevSrcRef = useRef<string>("");

  // Create or update audio element when src changes
  useEffect(() => {
    // If src changed, stop old audio
    if (audioRef.current && prevSrcRef.current !== src) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = "auto";
    audioRef.current = audio;
    prevSrcRef.current = src;

    // If music was enabled, auto-play the new track
    if (musicEnabled) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]); // Only react to src changes

  // Handle play/pause when musicEnabled changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (musicEnabled) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicEnabled]);

  return (
    <motion.button
      onClick={onToggle}
      className="fixed z-40 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full text-white cursor-pointer transition-colors"
      style={{ top: "16px", right: "16px", padding: "10px 18px", fontSize: "14px" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {musicEnabled ? "🔊" : "🔇"} {label}
    </motion.button>
  );
}
