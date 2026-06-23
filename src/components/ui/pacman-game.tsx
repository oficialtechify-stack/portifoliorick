"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 20;
const CELL_SIZE = 25;

const PacmanGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Initial state setup
    const pacman = useRef({
        x: 1,
        y: 1,
        dir: { x: 0, y: 0 },
        nextDir: { x: 0, y: 0 },
        angle: 0
    });

    const ghosts = useRef([
        { x: 18, y: 18, color: "#FF0000", dir: { x: -1, y: 0 } },
        { x: 1, y: 18, color: "#FFB8FF", dir: { x: 1, y: 0 } },
        { x: 18, y: 1, color: "#00FFFF", dir: { x: 0, y: 1 } }
    ]);

    const pellets = useRef<boolean[][]>([]);

    const wallMap = [
        "####################",
        "#........##........#",
        "#.##.###.##.###.##.#",
        "#.#.................#",
        "#.##.##.####.##.##.#",
        "#....#....##....#..#",
        "####.#### ## ####.####",
        "   #.#        #.#   ",
        "####.# ####### #.####",
        "     .         .     ",
        "####.# ####### #.####",
        "   #.#        #.#   ",
        "####.# ######## #.####",
        "#.........##........#",
        "#.###.###.##.###.###.#",
        "#...#............#...#",
        "###.#.##.####.##.#.###",
        "#....#....##....#....#",
        "#.#######.##.#######.#",
        "#....................#",
        "####################",
    ];

    useEffect(() => {
        // Initialize pellets
        const initialPellets: boolean[][] = [];
        for (let y = 0; y < wallMap.length; y++) {
            initialPellets[y] = [];
            for (let x = 0; x < wallMap[y].length; x++) {
                initialPellets[y][x] = wallMap[y][x] === ".";
            }
        }
        pellets.current = initialPellets;
    }, []);

    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frame = 0;
        const gameLoop = () => {
            frame++;
            if (frame % 10 === 0) {
                update();
            }
            draw(ctx);
            if (!gameOver) {
                requestAnimationFrame(gameLoop);
            }
        };

        const update = () => {
            // Check if nextDir is valid
            const nextX = pacman.current.x + pacman.current.nextDir.x;
            const nextY = pacman.current.y + pacman.current.nextDir.y;

            if (wallMap[nextY] && wallMap[nextY][nextX] !== "#") {
                pacman.current.dir = pacman.current.nextDir;
            }

            // Move pacman
            const newX = pacman.current.x + pacman.current.dir.x;
            const newY = pacman.current.y + pacman.current.dir.y;

            if (wallMap[newY] && wallMap[newY][newX] !== "#") {
                pacman.current.x = newX;
                pacman.current.y = newY;
                
                // Teleport
                if (pacman.current.x < 0) pacman.current.x = 19;
                if (pacman.current.x > 19) pacman.current.x = 0;

                // Eat pellet
                if (pellets.current[pacman.current.y][pacman.current.x]) {
                    pellets.current[pacman.current.y][pacman.current.x] = false;
                    setScore(s => s + 10);
                }
            }

            // Move ghosts
            ghosts.current.forEach(ghost => {
                const directions = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
                const validDirs = directions.filter(d => {
                    const gx = ghost.x + d.x;
                    const gy = ghost.y + d.y;
                    return wallMap[gy] && wallMap[gy][gx] !== "#";
                });

                if (validDirs.length > 0) {
                    // 20% chance to change direction randomly at intersections
                    if (Math.random() < 0.2 || !validDirs.some(d => d.x === ghost.dir.x && d.y === ghost.dir.y)) {
                        ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
                    }
                    ghost.x += ghost.dir.x;
                    ghost.y += ghost.dir.y;
                }

                // Check collision
                if (ghost.x === pacman.current.x && ghost.y === pacman.current.y) {
                    setGameOver(true);
                }
            });
        };

        const draw = (ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw walls
            for (let y = 0; y < wallMap.length; y++) {
                for (let x = 0; x < wallMap[y].length; x++) {
                    if (wallMap[y][x] === "#") {
                        ctx.fillStyle = "#2233AA";
                        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    } else if (pellets.current[y] && pellets.current[y][x]) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.beginPath();
                        ctx.arc(x * CELL_SIZE + CELL_SIZE/2, y * CELL_SIZE + CELL_SIZE/2, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            // Draw Pacman
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            const px = pacman.current.x * CELL_SIZE + CELL_SIZE/2;
            const py = pacman.current.y * CELL_SIZE + CELL_SIZE/2;
            
            let startAngle = 0.2 * Math.PI;
            let endAngle = 1.8 * Math.PI;

            if (pacman.current.dir.x === 1) { startAngle = 0.2 * Math.PI; endAngle = 1.8 * Math.PI; }
            if (pacman.current.dir.x === -1) { startAngle = 1.2 * Math.PI; endAngle = 0.8 * Math.PI; }
            if (pacman.current.dir.y === 1) { startAngle = 0.7 * Math.PI; endAngle = 0.3 * Math.PI; }
            if (pacman.current.dir.y === -1) { startAngle = 1.7 * Math.PI; endAngle = 1.3 * Math.PI; }

            ctx.moveTo(px, py);
            ctx.arc(px, py, CELL_SIZE/2 - 2, startAngle, endAngle);
            ctx.lineTo(px, py);
            ctx.fill();

            // Draw Ghosts
            ghosts.current.forEach(ghost => {
                ctx.fillStyle = ghost.color;
                const gx = ghost.x * CELL_SIZE + 2;
                const gy = ghost.y * CELL_SIZE + 2;
                const baseWidth = CELL_SIZE - 4;
                
                ctx.beginPath();
                ctx.arc(gx + baseWidth/2, gy + baseWidth/2, baseWidth/2, Math.PI, 0);
                ctx.lineTo(gx + baseWidth, gy + baseWidth);
                ctx.lineTo(gx, gy + baseWidth);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(gx + 6, gy + 8, 3, 0, Math.PI * 2);
                ctx.arc(gx + 14, gy + 8, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") pacman.current.nextDir = { x: 0, y: -1 };
            if (e.key === "ArrowDown") pacman.current.nextDir = { x: 0, y: 1 };
            if (e.key === "ArrowLeft") pacman.current.nextDir = { x: -1, y: 0 };
            if (e.key === "ArrowRight") pacman.current.nextDir = { x: 1, y: 0 };
        };

        window.addEventListener("keydown", handleKeys);
        requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener("keydown", handleKeys);
        };
    }, [isPlaying, gameOver]);

    const resetGame = () => {
        pacman.current = { x: 1, y: 1, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, angle: 0 };
        ghosts.current = [
            { x: 18, y: 18, color: "#FF0000", dir: { x: -1, y: 0 } },
            { x: 1, y: 18, color: "#FFB8FF", dir: { x: 1, y: 0 } },
            { x: 18, y: 1, color: "#00FFFF", dir: { x: 0, y: 1 } }
        ];
        
        const initialPellets: boolean[][] = [];
        for (let y = 0; y < wallMap.length; y++) {
            initialPellets[y] = [];
            for (let x = 0; x < wallMap[y].length; x++) {
                initialPellets[y][x] = wallMap[y][x] === ".";
            }
        }
        pellets.current = initialPellets;
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-zinc-950 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            
            <div className="relative z-10 w-full flex justify-between items-center mb-2">
                <div className="text-primary font-black italic uppercase tracking-tighter text-2xl">
                    PAC-MAN <span className="text-white/40">OFFLINE</span>
                </div>
                <div className="text-white font-mono text-xl">
                    SCORE: <span className="text-primary">{score}</span>
                </div>
            </div>

            <div className="relative border-4 border-primary/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(var(--primary),0.1)]">
                <canvas 
                    ref={canvasRef} 
                    width={20 * CELL_SIZE} 
                    height={21 * CELL_SIZE}
                    className="bg-black block"
                />
                
                {(!isPlaying || gameOver) && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                        <motion.h3 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black italic uppercase tracking-tighter text-white mb-6"
                        >
                            {gameOver ? "GAME OVER" : "INTERNET LOST"}
                        </motion.h3>
                        <button 
                            onClick={resetGame}
                            className="px-8 py-3 bg-primary text-black font-black italic uppercase tracking-tighter rounded-full hover:scale-105 active:scale-95 transition-transform"
                        >
                            {gameOver ? "TRY AGAIN" : "START GAME"}
                        </button>
                    </div>
                )}
            </div>

            <div className="text-white/40 text-xs font-medium uppercase tracking-widest text-center">
                Use arrows to move • eat pellets to survive
            </div>
        </div>
    );
};

export { PacmanGame };
