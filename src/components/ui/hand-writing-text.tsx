"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface HandWrittenTitleProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

function HandWrittenTitle({
    title = "Hand Written",
    subtitle = "Optional subtitle",
    className,
}: HandWrittenTitleProps) {
    const draw: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.5 },
            },
        },
    };

    return (
        <div className={cn("relative w-full py-12", className)}>
            <div className="absolute inset-0 pointer-events-none">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1200 600"
                    preserveAspectRatio="none"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full h-full"
                >
                    <motion.path
                        d="M 10 300 Q 300 100, 600 300 T 1190 300"
                        fill="none"
                        strokeWidth="4"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        className="text-primary opacity-20"
                    />
                </motion.svg>
            </div>
            <div className="relative z-10 flex flex-col items-start justify-center">
                <motion.h2
                    className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white cinema-text-shadow leading-[0.8]"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        className="text-2xl md:text-3xl font-black italic uppercase tracking-[0.2em] text-primary mt-4 drop-shadow-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );
}

export { HandWrittenTitle };
