'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * VideoPlayer - Figma: rounded-[44px], overlay rgba(0,0,0,0.6)
 * Texto: Sora SemiBold, Play button triângulo
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
    <div className={`relative w-full overflow-hidden rounded-[44px] aspect-video bg-black ${className}`}>
      {!isPlaying ? (
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          {/* Thumbnail */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />

          {/* Overlay - Figma: rgba(0,0,0,0.6) */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] group-hover:bg-[rgba(0,0,0,0.5)] transition-colors duration-300" />

          {/* Title & Play Button */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Figma: Sora SemiBold */}
            <h3 className="text-white font-sans font-semibold text-[24px] md:text-[40px] tracking-[-0.4px] text-center mb-6 leading-tight">
              {title}
            </h3>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center"
            >
              <svg width="69" height="93" viewBox="0 0 69 93" fill="none" className="w-[40px] h-[54px] md:w-[69px] md:h-[93px]">
                <path d="M69 46.5L0 93L0 0L69 46.5Z" fill="white" fillOpacity="0.8"/>
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
