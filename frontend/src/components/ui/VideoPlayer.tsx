'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * VideoPlayer - Figma: rounded-[44px] desktop, rounded-[20px] mobile
 * Overlay: rgba(0,0,0,0.6), Sora SemiBold, play triangle
 */

interface VideoPlayerProps {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  className?: string;
}

export default function VideoPlayer({ videoId, title, thumbnailUrl, className = '' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`relative w-full overflow-hidden rounded-[20px] md:rounded-[44px] bg-virtu-green-dark aspect-video ${className}`}>
      {!isPlaying ? (
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          {thumbnailUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)] group-hover:bg-[rgba(0,0,0,0.45)] transition-colors duration-300" />
          <div className="relative z-10 flex flex-col items-center px-4">
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center"
            >
              <svg viewBox="0 0 69 93" fill="none" className="w-5 h-7 sm:w-7 sm:h-9 md:w-9 md:h-12">
                <path d="M69 46.5L0 93L0 0L69 46.5Z" fill="white" fillOpacity="0.85"/>
              </svg>
            </motion.div>
          </div>
        </div>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
