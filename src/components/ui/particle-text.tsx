import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeSystem } from "./theme-switcher";

interface ParticleTextProps {
  text?: string;
  fontFamily?: string;
  className?: string;
}

export const ParticleText: React.FC<ParticleTextProps> = ({
  text = "RICKZINXX",
  fontFamily = "system-ui, sans-serif",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useThemeSystem();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const settings = {
      cellSize: 3,
      releaseTestsPerFrame: 1800,
      releaseChance: 0.025,
      gravity: 850,
      airDrag: 0.992,
      settleStepsPerFrame: 5,
      pileHoldSeconds: 0.6,
      hiddenFadeInSeconds: 0.45,
      reformDurationSeconds: 1.8,
      reformStaggerSeconds: 0.5,
      revealHoldSeconds: 3,
      revealFadeSeconds: 0.6,
    };

    let cols = 0;
    let rows = 0;

    let fixedCodepen = new Uint8Array(0);
    let codepenCells: number[] = [];
    let looseCells: number[] = [];

    interface FallingParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      drift: number;
      driftTarget: number;
      driftTimer: number;
    }

    interface ReformingParticle {
      sx: number;
      sy: number;
      tx: number;
      ty: number;
      x: number;
      y: number;
      delay: number;
      duration: number;
      wave: number;
      phaseOffset: number;
    }

    let falling: FallingParticle[] = [];
    let pile = new Uint8Array(0);
    let reforming: ReformingParticle[] = [];

    let hiddenAlpha = 0;
    let phase = "codepen";
    let phaseTime = 0;
    let lastTime = performance.now();
    let animFrameId: number;

    const mouse = { x: -1000, y: -1000, active: false };

    function index(col: number, row: number) {
      return row * cols + col;
    }

    function colFromIndex(i: number) {
      return i % cols;
    }

    function rowFromIndex(i: number) {
      return Math.floor(i / cols);
    }

    function inBounds(col: number, row: number) {
      return col >= 0 && col < cols && row >= 0 && row < rows;
    }

    function rand(min: number, max: number) {
      return min + Math.random() * (max - min);
    }

    function randInt(min: number, max: number) {
      return Math.floor(min + Math.random() * (max - min + 1));
    }

    function clamp01(v: number) {
      return Math.max(0, Math.min(1, v));
    }

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function shuffle(array: number[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    function buildText() {
      const maskCanvas = document.createElement("canvas");
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) return;

      maskCanvas.width = w;
      maskCanvas.height = h;

      // Calculate perfect responsive font size
      const fontSize = Math.min(w * 0.13, h * 0.42, 105);

      maskCtx.clearRect(0, 0, w, h);
      maskCtx.fillStyle = "#fff";
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";
      maskCtx.font = `900 ${fontSize}px ${fontFamily}`;

      // Place text higher up to allow plenty of room for sand to fall
      maskCtx.fillText(text, w / 2, h * 0.42);

      const image = maskCtx.getImageData(0, 0, w, h).data;

      codepenCells = [];
      looseCells = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = Math.floor(col * settings.cellSize + settings.cellSize / 2);
          const y = Math.floor(row * settings.cellSize + settings.cellSize / 2);

          const pixelIndex = (y * w + x) * 4;
          const alpha = image[pixelIndex + 3];

          if (alpha > 45) {
            const i = index(col, row);
            fixedCodepen[i] = 1;
            codepenCells.push(i);
            looseCells.push(i);
          }
        }
      }

      shuffle(looseCells);
    }

    function resetCycle() {
      fixedCodepen.fill(0);
      pile.fill(0);

      looseCells = codepenCells.slice();
      shuffle(looseCells);

      falling = [];
      reforming = [];

      for (const cell of codepenCells) {
        fixedCodepen[cell] = 1;
      }

      hiddenAlpha = 0;
      phase = "codepen";
      phaseTime = 0;
    }

    function releaseOneGrain(cellIndex: number) {
      const col = colFromIndex(cellIndex);
      const row = rowFromIndex(cellIndex);

      fixedCodepen[cellIndex] = 0;

      falling.push({
        x: col * settings.cellSize,
        y: row * settings.cellSize,
        vx: rand(-22, 22),
        vy: rand(40, 150),
        drift: rand(-55, 55),
        driftTarget: rand(-85, 85),
        driftTimer: rand(0.18, 0.9),
      });
    }

    function releaseCodepen() {
      if (looseCells.length === 0) {
        phase = "falling";
        phaseTime = 0;
        return;
      }

      for (let i = 0; i < settings.releaseTestsPerFrame; i++) {
        if (looseCells.length === 0) break;

        const listIndex = randInt(0, looseCells.length - 1);
        const cellIndex = looseCells[listIndex];

        if (fixedCodepen[cellIndex] === 0) {
          looseCells.splice(listIndex, 1);
          continue;
        }

        const col = colFromIndex(cellIndex);
        const row = rowFromIndex(cellIndex);

        const belowEmpty =
          row >= rows - 1 ||
          fixedCodepen[index(col, Math.min(row + 1, rows - 1))] === 0;

        const sideEmpty =
          col <= 0 ||
          col >= cols - 1 ||
          fixedCodepen[index(Math.max(col - 1, 0), row)] === 0 ||
          fixedCodepen[index(Math.min(col + 1, cols - 1), row)] === 0;

        const edgeMultiplier = belowEmpty || sideEmpty ? 3.3 : 1;

        if (Math.random() < settings.releaseChance * edgeMultiplier) {
          releaseOneGrain(cellIndex);
          looseCells.splice(listIndex, 1);
        }
      }
    }

    function pileSolid(col: number, row: number) {
      if (row >= rows) return true;
      if (col < 0 || col >= cols) return true;
      return pile[index(col, row)] === 1;
    }

    function setPile(col: number, row: number) {
      if (!inBounds(col, row)) return;
      pile[index(col, row)] = 1;
    }

    function settleFallingParticle(p: FallingParticle) {
      let col = Math.floor(p.x / settings.cellSize);
      let row = Math.floor(p.y / settings.cellSize);

      col = Math.max(0, Math.min(cols - 1, col));
      row = Math.max(0, Math.min(rows - 1, row));

      if (!pileSolid(col, row)) {
        setPile(col, row);
        return;
      }

      if (!pileSolid(col - 1, row)) {
        setPile(col - 1, row);
        return;
      }

      if (!pileSolid(col + 1, row)) {
        setPile(col + 1, row);
        return;
      }

      for (let y = row - 1; y >= 0; y--) {
        if (!pileSolid(col, y)) {
          setPile(col, y);
          return;
        }
      }
    }

    function updateFalling(dt: number) {
      for (let i = falling.length - 1; i >= 0; i--) {
        const p = falling[i];

        p.driftTimer -= dt;

        if (p.driftTimer <= 0) {
          p.driftTarget = rand(-85, 85);
          p.driftTimer = rand(0.25, 1.2);
        }

        p.drift += (p.driftTarget - p.drift) * dt * 2;

        p.vx += p.drift * dt;
        p.vy += settings.gravity * dt;

        p.vx *= settings.airDrag;
        p.vy *= settings.airDrag;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Mouse interaction with falling particles
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 2025) { // 45px radius
            const dist = Math.sqrt(distSq) || 1;
            const force = (45 - dist) / 45;
            p.vx += (dx / dist) * force * 150;
            p.vy += (dy / dist) * force * 150;
          }
        }

        let col = Math.floor(p.x / settings.cellSize);
        const nextRow = Math.floor((p.y + settings.cellSize) / settings.cellSize);

        if (p.x < -20) p.x = 0;
        if (p.x > w + 20) p.x = w - settings.cellSize;

        col = Math.max(0, Math.min(cols - 1, col));

        if (nextRow >= rows || pileSolid(col, nextRow)) {
          settleFallingParticle(p);
          falling.splice(i, 1);
        }
      }

      if (phase === "falling" && falling.length === 0) {
        phase = "pile";
        phaseTime = 0;
      }
    }

    function settlePile() {
      const leftToRight = Math.random() > 0.5;

      for (let row = rows - 2; row >= 0; row--) {
        if (leftToRight) {
          for (let col = 1; col < cols - 1; col++) {
            settlePileCell(col, row);
          }
        } else {
          for (let col = cols - 2; col >= 1; col--) {
            settlePileCell(col, row);
          }
        }
      }
    }

    function settlePileCell(col: number, row: number) {
      const current = index(col, row);

      if (pile[current] !== 1) return;

      if (!pileSolid(col, row + 1)) {
        pile[index(col, row + 1)] = 1;
        pile[current] = 0;
        return;
      }

      const preferLeft = Math.random() > 0.5;

      if (preferLeft) {
        if (!pileSolid(col - 1, row + 1)) {
          pile[index(col - 1, row + 1)] = 1;
          pile[current] = 0;
          return;
        }

        if (!pileSolid(col + 1, row + 1)) {
          pile[index(col + 1, row + 1)] = 1;
          pile[current] = 0;
          return;
        }
      } else {
        if (!pileSolid(col + 1, row + 1)) {
          pile[index(col + 1, row + 1)] = 1;
          pile[current] = 0;
          return;
        }

        if (!pileSolid(col - 1, row + 1)) {
          pile[index(col - 1, row + 1)] = 1;
          pile[current] = 0;
          return;
        }
      }
    }

    function collectPileCells() {
      const cells: number[] = [];
      for (let row = rows - 1; row >= 0; row--) {
        for (let col = 0; col < cols; col++) {
          const i = index(col, row);
          if (pile[i] === 1) {
            cells.push(i);
          }
        }
      }
      return cells;
    }

    function startReform() {
      const pileCells = collectPileCells();
      const targets = codepenCells.slice();

      pile.fill(0);

      pileCells.sort((a, b) => rowFromIndex(b) - rowFromIndex(a));
      targets.sort((a, b) => rowFromIndex(b) - rowFromIndex(a));

      const count = Math.min(pileCells.length, targets.length);

      reforming = [];

      for (let i = 0; i < count; i++) {
        const source = pileCells[i];
        const target = targets[i];

        const sx = colFromIndex(source) * settings.cellSize;
        const sy = rowFromIndex(source) * settings.cellSize;
        const tx = colFromIndex(target) * settings.cellSize;
        const ty = rowFromIndex(target) * settings.cellSize;

        reforming.push({
          sx,
          sy,
          tx,
          ty,
          x: sx,
          y: sy,
          delay: rand(0, settings.reformStaggerSeconds),
          duration: rand(
            settings.reformDurationSeconds * 0.75,
            settings.reformDurationSeconds * 1.15
          ),
          wave: rand(-18, 18),
          phaseOffset: rand(0, Math.PI * 2),
        });
      }

      phase = "reform";
      phaseTime = 0;
    }

    function updateReform(dt: number) {
      hiddenAlpha = 1;
      let allArrived = true;

      for (const p of reforming) {
        const localTime = phaseTime - p.delay;

        if (localTime <= 0) {
          p.x = p.sx;
          p.y = p.sy;
          allArrived = false;
          continue;
        }

        const t = clamp01(localTime / p.duration);
        const eased = easeInOutCubic(t);

        const arc = Math.sin(eased * Math.PI);
        const wobble = Math.sin(eased * Math.PI * 2 + p.phaseOffset) * p.wave * arc;

        p.x = p.sx + (p.tx - p.sx) * eased + wobble;
        p.y = p.sy + (p.ty - p.sy) * eased - arc * h * 0.12;

        if (t < 1) {
          allArrived = false;
        }
      }

      if (allArrived) {
        for (const cell of codepenCells) {
          fixedCodepen[cell] = 1;
        }
        reforming = [];
        phase = "hiddenHold";
        phaseTime = 0;
        hiddenAlpha = 1;
      }
    }

    function updatePhase(dt: number) {
      phaseTime += dt;

      if (phase === "codepen") {
        releaseCodepen();
      }

      if (phase === "pile" && phaseTime >= settings.pileHoldSeconds) {
        phase = "hiddenFadeIn";
        phaseTime = 0;
        hiddenAlpha = 0;
      }

      if (phase === "hiddenFadeIn") {
        hiddenAlpha = Math.min(1, phaseTime / settings.hiddenFadeInSeconds);

        if (hiddenAlpha >= 1) {
          hiddenAlpha = 1;
          startReform();
        }
      }

      if (phase === "reform") {
        updateReform(dt);
      }

      if (phase === "hiddenHold") {
        hiddenAlpha = 1;
        if (phaseTime >= settings.revealHoldSeconds) {
          phase = "hiddenFade";
          phaseTime = 0;
        }
      }

      if (phase === "hiddenFade") {
        hiddenAlpha = Math.max(0, 1 - phaseTime / settings.revealFadeSeconds);

        if (hiddenAlpha <= 0) {
          hiddenAlpha = 0;
          resetCycle();
        }
      }
    }

    function drawHiddenText() {
      if (hiddenAlpha <= 0) return;

      ctx.save();
      const fontSize = 11;
      ctx.globalAlpha = hiddenAlpha;
      ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${fontSize}px system-ui, sans-serif`;

      const hiddenTextStr = i18n.language.startsWith("pt")
        ? "BEM-VINDO AO MEU MUNDO, O CÓDIGO ESCORRE COMO AREIA"
        : "WELCOME TO MY WORLD, CODE FLOWS LIKE SAND";

      ctx.fillText(hiddenTextStr, w / 2, h - 25);
      ctx.restore();
    }

    function drawFixedCodepen() {
      ctx.fillStyle = theme === "dark" ? "rgb(255, 40, 0)" : "rgb(220, 30, 0)";
      const size = settings.cellSize;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (fixedCodepen[index(col, row)] !== 1) continue;

          ctx.fillRect(col * size, row * size, size, size);
        }
      }
    }

    function drawFalling() {
      ctx.fillStyle = theme === "dark" ? "rgb(255, 65, 20)" : "rgb(220, 30, 0)";
      const size = settings.cellSize;

      for (const p of falling) {
        ctx.fillRect(p.x, p.y, size, size);
      }
    }

    function drawPile() {
      ctx.fillStyle = theme === "dark" ? "rgb(255, 40, 0)" : "rgb(220, 30, 0)";
      const size = settings.cellSize;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (pile[index(col, row)] !== 1) continue;

          ctx.fillRect(col * size, row * size, size, size);
        }
      }
    }

    function drawReforming() {
      ctx.fillStyle = theme === "dark" ? "rgb(255, 75, 30)" : "rgb(220, 30, 0)";
      const size = settings.cellSize;

      for (const p of reforming) {
        ctx.fillRect(p.x, p.y, size, size);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      drawHiddenText();
      drawFixedCodepen();
      drawFalling();
      drawPile();
      drawReforming();
    }

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      updatePhase(dt);
      updateFalling(dt);

      if (phase !== "reform" && phase !== "hiddenHold" && phase !== "hiddenFade") {
        for (let i = 0; i < settings.settleStepsPerFrame; i++) {
          settlePile();
        }
      }

      // Splash effect / disturb pile when mouse is actively swiped through it
      if (mouse.active) {
        const mouseCol = Math.floor(mouse.x / settings.cellSize);
        const mouseRow = Math.floor(mouse.y / settings.cellSize);
        const radius = 6;
        for (let rOffset = -radius; rOffset <= radius; rOffset++) {
          for (let cOffset = -radius; cOffset <= radius; cOffset++) {
            const c = mouseCol + cOffset;
            const r = mouseRow + rOffset;
            if (inBounds(c, r)) {
              const idx = index(c, r);
              if (pile[idx] === 1 && Math.random() < 0.65) {
                pile[idx] = 0;
                falling.push({
                  x: c * settings.cellSize,
                  y: r * settings.cellSize,
                  vx: rand(-60, 60),
                  vy: rand(-40, -120),
                  drift: rand(-55, 55),
                  driftTarget: rand(-85, 85),
                  driftTimer: rand(0.18, 0.9),
                });
              }
            }
          }
        }
      }

      draw();
      animFrameId = requestAnimationFrame(tick);
    }

    function resize() {
      const rect = containerRef.current?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: 240,
      };
      w = rect.width || window.innerWidth;
      h = rect.height || 240;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / settings.cellSize);
      rows = Math.ceil(h / settings.cellSize);

      fixedCodepen = new Uint8Array(cols * rows);
      pile = new Uint8Array(cols * rows);

      codepenCells = [];
      looseCells = [];
      falling = [];
      reforming = [];

      hiddenAlpha = 0;
      phase = "codepen";
      phaseTime = 0;

      buildText();
    }

    resize();
    animFrameId = requestAnimationFrame(tick);

    const handleResize = () => {
      resize();
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseLeave);
    };
  }, [text, fontFamily, theme, i18n.language]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[220px] md:h-[260px] overflow-hidden select-none cursor-pointer ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
