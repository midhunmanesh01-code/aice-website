"use client";

import { useEffect, useRef } from "react";
import styles from "./ParticleBackground.module.css";

interface Particle {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  colorType: "red" | "white" | "grey";
  depth: number;
  oscillationPhase: number;
  oscillationSpeed: number;
  connections: number;
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isTabVisible = !document.hidden;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let prefersReducedMotion = reducedMotionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      active: false,
      lastMoved: 0,
      fadeOpacity: 0,
    };

    let particles: Particle[] = [];

    const initParticles = (w: number, h: number) => {
      const isMobile = w < 768;
      // Tailored count for clean, high-impact constellation aesthetic
      const count = isMobile
        ? Math.max(30, Math.min(45, Math.floor((w * h) / 18000)))
        : Math.max(55, Math.min(85, Math.floor((w * h) / 14000)));

      particles = [];

      for (let i = 0; i < count; i++) {
        const depth = 0.35 + Math.random() * 0.65;
        const roll = Math.random();

        let colorType: "red" | "white" | "grey";
        let radius: number;
        let baseAlpha: number;

        // ~24% prominent red nodes, ~36% crisp white, ~40% cool silver
        if (roll < 0.24) {
          colorType = "red";
          radius = 2.4 + depth * 1.4;
          baseAlpha = 0.85 + depth * 0.15;
        } else if (roll < 0.6) {
          colorType = "white";
          radius = 1.6 + depth * 1.2;
          baseAlpha = 0.75 + depth * 0.25;
        } else {
          colorType = "grey";
          radius = 1.2 + depth * 0.9;
          baseAlpha = 0.45 + depth * 0.35;
        }

        const angle = Math.random() * Math.PI * 2;
        const speed = (0.06 + Math.random() * 0.12) * depth;
        const baseVx = Math.cos(angle) * speed;
        const baseVy = Math.sin(angle) * speed;

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseVx,
          baseVy,
          vx: baseVx,
          vy: baseVy,
          radius,
          baseAlpha,
          colorType,
          depth,
          oscillationPhase: Math.random() * Math.PI * 2,
          oscillationSpeed: 0.006 + Math.random() * 0.01,
          connections: 0,
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles(width, height);

      if (prefersReducedMotion) {
        renderFrame();
      }
    };

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      const maxConnectDist = isMobile ? 110 : 155;

      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        if (Date.now() - mouse.lastMoved > 2500) {
          mouse.fadeOpacity = Math.max(0, mouse.fadeOpacity - 0.02);
          if (mouse.fadeOpacity === 0) mouse.active = false;
        } else {
          mouse.fadeOpacity = Math.min(1, mouse.fadeOpacity + 0.05);
        }
      }

      const parallaxX =
        mouse.active && mouse.fadeOpacity > 0
          ? ((mouse.x - width / 2) / width) * 18 * mouse.fadeOpacity
          : 0;
      const parallaxY =
        mouse.active && mouse.fadeOpacity > 0
          ? ((mouse.y - height / 2) / height) * 18 * mouse.fadeOpacity
          : 0;

      const particleCount = particles.length;

      for (let i = 0; i < particleCount; i++) {
        particles[i].connections = 0;
      }

      if (!prefersReducedMotion) {
        const interactRadius = isMobile ? 110 : 150;

        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];
          p.oscillationPhase += p.oscillationSpeed;

          if (mouse.active && mouse.fadeOpacity > 0) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < interactRadius && dist > 1) {
              const norm = 1 - dist / interactRadius;
              const force = norm * 0.55 * p.depth * mouse.fadeOpacity;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          p.vx += (p.baseVx - p.vx) * 0.03;
          p.vy += (p.baseVy - p.vy) * 0.03;

          p.x += p.vx + Math.cos(p.oscillationPhase) * 0.1 * p.depth;
          p.y += p.vy + Math.sin(p.oscillationPhase) * 0.1 * p.depth;

          const pad = 25;
          if (p.x < -pad) p.x = width + pad;
          else if (p.x > width + pad) p.x = -pad;

          if (p.y < -pad) p.y = height + pad;
          else if (p.y > height + pad) p.y = -pad;
        }
      }

      const rx: number[] = new Array(particleCount);
      const ry: number[] = new Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        rx[i] = p.x + parallaxX * p.depth;
        ry[i] = p.y + parallaxY * p.depth;
      }


      // Draw constellation nodes
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const posX = rx[i];
        const posY = ry[i];

        ctx.beginPath();
        ctx.arc(posX, posY, p.radius, 0, Math.PI * 2);

        if (p.colorType === "red") {
          // Brilliant neon red with glowing halo
          ctx.shadowColor = "rgba(255, 32, 32, 0.95)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(255, 36, 36, ${p.baseAlpha})`;
        } else if (p.colorType === "white") {
          if (p.depth > 0.7) {
            ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
            ctx.shadowBlur = 6;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${p.baseAlpha})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(160, 160, 175, ${p.baseAlpha})`;
        }

        ctx.fill();
      }

      ctx.shadowBlur = 0;
    };

    const loop = () => {
      if (!isTabVisible || prefersReducedMotion) {
        animationFrameId = null;
        return;
      }
      renderFrame();
      animationFrameId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (prefersReducedMotion || !isTabVisible) {
        renderFrame();
        return;
      }
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouse.targetX = clientX;
      mouse.targetY = clientY;

      if (!mouse.active) {
        mouse.x = clientX;
        mouse.y = clientY;
      }

      mouse.active = true;
      mouse.lastMoved = Date.now();
    };

    const handlePointerLeave = () => {
      mouse.lastMoved = 0;
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        stopLoop();
        renderFrame();
      } else {
        startLoop();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resizeObserver.observe(container);

    resize();
    startLoop();

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      <div className={styles.portraitAura} />
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* ── Glowing Planet Arc in Bottom Right ── */}
      <div className={styles.cosmicArcContainer}>
        <svg
          className={styles.cosmicArcSvg}
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="planetNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="36" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient
              id="planetAtmosphere"
              cx="100%"
              cy="100%"
              r="95%"
              fx="100%"
              fy="100%"
            >
              <stop offset="0%" stopColor="#1e0508" stopOpacity="0.88" />
              <stop offset="45%" stopColor="#120204" stopOpacity="0.65" />
              <stop offset="78%" stopColor="#ff2020" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ff2020" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* Atmospheric planet body */}
          <path
            d="M 1000 200 A 800 800 0 0 0 200 1000 L 1000 1000 Z"
            fill="url(#planetAtmosphere)"
          />

          {/* Razor-sharp neon red planet horizon rim */}
          <path
            d="M 1000 200 A 800 800 0 0 0 200 1000"
            stroke="#ff2424"
            strokeWidth="3"
            filter="url(#planetNeonGlow)"
          />
          <path
            d="M 1000 200 A 800 800 0 0 0 200 1000"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        </svg>
      </div>

      <div className={styles.vignette} />
    </div>
  );
}
