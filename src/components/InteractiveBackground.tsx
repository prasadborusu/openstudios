"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface CurvedLine {
  startX: number;
  startY: number;
  cp1X: number;
  cp1Y: number;
  cp2X: number;
  cp2Y: number;
  endX: number;
  endY: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive configuration
    const isMobile = width < 768;
    const gridSize = isMobile ? 100 : 80;
    const maxParticles = isMobile ? 15 : 40;
    const glowRadius = isMobile ? 100 : 180;

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Static large circular outlines (Depth layering)
    const circles = [
      { x: width * 0.2, y: height * 0.3, r: isMobile ? 150 : 300, speed: 0.0005 },
      { x: width * 0.8, y: height * 0.7, r: isMobile ? 200 : 450, speed: -0.0003 },
      { x: width * 0.5, y: height * 0.5, r: isMobile ? 250 : 600, speed: 0.0002 },
    ];

    // Static curved lines (Futuristic circuit-like feel)
    const curves: CurvedLine[] = [
      {
        startX: 0,
        startY: height * 0.15,
        cp1X: width * 0.25,
        cp1Y: height * 0.05,
        cp2X: width * 0.5,
        cp2Y: height * 0.35,
        endX: width,
        endY: height * 0.25,
      },
      {
        startX: 0,
        startY: height * 0.75,
        cp1X: width * 0.3,
        cp1Y: height * 0.9,
        cp2X: width * 0.7,
        cp2Y: height * 0.6,
        endX: width,
        endY: height * 0.85,
      },
    ];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Helper to calculate distance from point to segment
    const getDistToSegment = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      if (l2 === 0) return (px - x1) ** 2 + (py - y1) ** 2;
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.sqrt((px - (x1 + t * (x2 - x1))) ** 2 + (py - (y1 + t * (y2 - y1))) ** 2);
    };

    // Main animation loop
    const animate = (time: number) => {
      // Clear with very subtle transparency to create a tiny tail if desired,
      // but for pure dark background, we clear it fully.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // 1. Draw grid pattern (subtle transparent lines)
      ctx.lineWidth = 1;
      const cols = Math.ceil(width / gridSize);
      const rows = Math.ceil(height / gridSize);

      for (let i = 0; i <= cols; i++) {
        const gx = i * gridSize;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);

        // Grid illumination logic
        if (mouseActive) {
          const dist = Math.abs(gx - mx);
          if (dist < glowRadius) {
            const intensity = (1 - dist / glowRadius) * 0.15;
            ctx.strokeStyle = `rgba(37, 99, 235, ${intensity})`;
          } else {
            ctx.strokeStyle = "rgba(0, 0, 0, 0.025)";
          }
        } else {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.015)";
        }
        ctx.stroke();
      }

      for (let j = 0; j <= rows; j++) {
        const gy = j * gridSize;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);

        if (mouseActive) {
          const dist = Math.abs(gy - my);
          if (dist < glowRadius) {
            const intensity = (1 - dist / glowRadius) * 0.15;
            ctx.strokeStyle = `rgba(37, 99, 235, ${intensity})`;
          } else {
            ctx.strokeStyle = "rgba(0, 0, 0, 0.025)";
          }
        } else {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.015)";
        }
        ctx.stroke();
      }

      // 2. Draw large circular outlines with slow rotation / orbit
      circles.forEach((circle, idx) => {
        const offsetAngle = time * circle.speed;
        ctx.beginPath();
        ctx.arc(
          circle.x + Math.cos(offsetAngle) * 20,
          circle.y + Math.sin(offsetAngle) * 20,
          circle.r,
          0,
          Math.PI * 2
        );

        if (mouseActive) {
          // Approximate distance to circle circumference
          const dx = mx - circle.x;
          const dy = my - circle.y;
          const distToCenter = Math.sqrt(dx * dx + dy * dy);
          const distToCircumference = Math.abs(distToCenter - circle.r);
          
          if (distToCircumference < glowRadius) {
            const intensity = (1 - distToCircumference / glowRadius) * 0.18;
            ctx.strokeStyle = `rgba(37, 99, 235, ${intensity})`;
          } else {
            ctx.strokeStyle = "rgba(0, 0, 0, 0.025)";
          }
        } else {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.015)";
        }
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Draw curved lines
      curves.forEach((curve) => {
        ctx.beginPath();
        ctx.moveTo(curve.startX, curve.startY);
        ctx.bezierCurveTo(
          curve.cp1X,
          curve.cp1Y,
          curve.cp2X,
          curve.cp2Y,
          curve.endX,
          curve.endY
        );

        // Approximate interaction by checking distance to mouse
        // (Since computing exact bezier distance is complex, we sample points on the curve)
        let minCurveDist = Infinity;
        if (mouseActive) {
          const sampleCount = 10;
          let prevX = curve.startX;
          let prevY = curve.startY;
          for (let s = 1; s <= sampleCount; s++) {
            const t = s / sampleCount;
            // Bezier formula
            const cx =
              (1 - t) ** 3 * curve.startX +
              3 * (1 - t) ** 2 * t * curve.cp1X +
              3 * (1 - t) * t ** 2 * curve.cp2X +
              t ** 3 * curve.endX;
            const cy =
              (1 - t) ** 3 * curve.startY +
              3 * (1 - t) ** 2 * t * curve.cp1Y +
              3 * (1 - t) * t ** 2 * curve.cp2Y +
              t ** 3 * curve.endY;

            const segmentDist = getDistToSegment(mx, my, prevX, prevY, cx, cy);
            if (segmentDist < minCurveDist) {
              minCurveDist = segmentDist;
            }
            prevX = cx;
            prevY = cy;
          }
        }

        if (mouseActive && minCurveDist < glowRadius) {
          const intensity = (1 - minCurveDist / glowRadius) * 0.3;
          ctx.strokeStyle = `rgba(37, 99, 235, ${intensity})`;
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.025)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });

      // 4. Draw soft floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Glow near mouse
        if (mouseActive) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < glowRadius) {
            const factor = 1 - dist / glowRadius;
            ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha + factor * 0.4})`;
          } else {
            ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha * 0.25})`;
          }
        } else {
          ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha * 0.25})`;
        }
        ctx.fill();
      });

      // 5. Draw mouse radial ambient spotlight glow (soft blue light background)
      if (mouseActive && !isMobile) {
        const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius * 1.5);
        glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.08)");
        glowGrad.addColorStop(0.5, "rgba(37, 99, 235, 0.02)");
        glowGrad.addColorStop(1, "rgba(37, 99, 235, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mx, my, glowRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-white pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
