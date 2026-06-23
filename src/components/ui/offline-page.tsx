"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glitchy404 } from "./glitchy-404-1";
import { PacmanGame } from "./pacman-game";
import { RefreshCw, WifiOff, Home } from "lucide-react";
import { ShaderButton } from "./shader-button";

export function OfflinePage() {
    const [isReconnecting, setIsReconnecting] = useState(false);

    const handleRetry = () => {
        setIsReconnecting(true);
        setTimeout(() => {
            setIsReconnecting(false);
            window.location.reload();
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ff3333_0%,transparent_50%)] blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-8 flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md"
                >
                    <WifiOff className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black italic uppercase tracking-widest text-white/60">
                        Signal Lost • System Offline
                    </span>
                </motion.div>

                <div className="mb-4 sm:mb-8 overflow-hidden w-full flex justify-center scale-75 sm:scale-100 origin-center">
                    <Glitchy404 color="#ff3333" width={600} height={180} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-md scale-[0.8] sm:scale-100 origin-top"
                >
                    <PacmanGame />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 sm:mt-12 flex flex-col sm:flex-row gap-4 items-center"
                >
                    <ShaderButton 
                        onClick={handleRetry}
                        className="w-48"
                    >
                        <span className="flex items-center gap-2">
                             {isReconnecting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                             ) : (
                                <RefreshCw className="w-4 h-4" />
                             )}
                             {isReconnecting ? "SYNCING..." : "RETRY SYNC"}
                        </span>
                    </ShaderButton>

                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2 group"
                    >
                        <Home className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
                        <span className="text-sm font-black italic uppercase tracking-tighter">Return to Base</span>
                    </button>
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8 text-[10px] uppercase font-bold tracking-[0.3em] text-white/40"
                >
                    System Protocol 404 • Wait for reconnection
                </motion.p>
            </div>

            {/* Scanline effect */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
}
