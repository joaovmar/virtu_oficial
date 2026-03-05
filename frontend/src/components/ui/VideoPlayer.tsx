'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
    videoId: string;
    title: string;
    thumbnailUrl: string;
    className?: string;
}

export default function VideoPlayer({ videoId, title, thumbnailUrl, className = '' }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className={`relative w-full overflow-hidden rounded-3xl aspect-video bg-virtu-dark ${className}`}>
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

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                    {/* Title & Play Button */}
                    <div className="relative z-10 flex flex-col items-center">
                        <h3 className="text-white text-3xl md:text-5xl font-display italic mb-6 shadow-sm">{title}</h3>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                        >
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
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
                ></iframe>
            )}
        </div>
    );
}
