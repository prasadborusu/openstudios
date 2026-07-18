"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Animation values to interpolate smoothly (lerp)
  const mouseState = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    intensity: 0,
    targetIntensity: 0,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
  });

  useEffect(() => {
    // Load the logo image for canvas masking
    const img = new Image();
    img.src = "/logo_web.png";
    img.onload = () => {
      imageRef.current = img;
      setImgLoaded(true);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !imgLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      // Distance from mouse to center of the logo
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // We want interaction within 300px
      const maxDistance = 300;
      if (distance < maxDistance) {
        // Higher intensity when closer
        mouseState.current.targetIntensity = Math.min(1.0, 1 - distance / maxDistance);
        
        // Tilt values (max 12 degrees)
        mouseState.current.targetTiltX = (dy / rect.height) * 12;
        mouseState.current.targetTiltY = -(dx / rect.width) * 12;

        // Position relative to canvas
        mouseState.current.targetX = e.clientX - rect.left;
        mouseState.current.targetY = e.clientY - rect.top;
      } else {
        mouseState.current.targetIntensity = 0;
        mouseState.current.targetTiltX = 0;
        mouseState.current.targetTiltY = 0;
      }
    };

    const handleMouseLeave = () => {
      mouseState.current.targetIntensity = 0;
      mouseState.current.targetTiltX = 0;
      mouseState.current.targetTiltY = 0;
    };

    // Track mouse movement globally to detect approach
    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Render loop
    const render = (time: number) => {
      // Lerp mouse positions and intensities
      const state = mouseState.current;
      state.intensity += (state.targetIntensity - state.intensity) * 0.08;
      state.x += (state.targetX - state.x) * 0.1;
      state.y += (state.targetY - state.y) * 0.1;
      state.tiltX += (state.targetTiltX - state.tiltX) * 0.08;
      state.tiltY += (state.targetTiltY - state.tiltY) * 0.08;

      // Apply 3D tilt and floating effect to container style
      const floatOffset = Math.sin(time * 0.002) * 8; // Float 8px
      const floatRot = Math.cos(time * 0.0015) * 0.6; // Rotate 0.6deg
      
      container.style.transform = `
        perspective(1000px)
        rotateX(${state.tiltX}deg)
        rotateY(${state.tiltY}deg)
        translateY(${floatOffset}px)
        rotateZ(${floatRot}deg)
      `;

      ctx.clearRect(0, 0, width, height);

      // Check width for mobile
      const isMobile = window.innerWidth < 768;

      if (imageRef.current) {
        // Draw base transparent logo (fully clear and visible)
        // High opacity when mouse is close, slightly lower when far
        ctx.globalAlpha = 0.92 + 0.08 * state.intensity;
        ctx.drawImage(imageRef.current, 0, 0, width, height);

        // 1. Draw glowing color illumination inside the logo shape
        if (state.intensity > 0.01 && !isMobile) {
          // Offscreen drawing for masking
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext("2d");
          
          if (tempCtx) {
            // Draw logo image first
            tempCtx.drawImage(imageRef.current, 0, 0, width, height);

            // Compose destination-in to clip subsequent drawing to logo shape
            tempCtx.globalCompositeOperation = "source-in";

            // Draw radial blue gradient centered at mouse coordinates
            const rad = width * 0.55;
            const grad = tempCtx.createRadialGradient(state.x, state.y, 0, state.x, state.y, rad);
            grad.addColorStop(0, `rgba(37, 99, 235, ${0.9 * state.intensity})`);
            grad.addColorStop(0.3, `rgba(59, 130, 246, ${0.6 * state.intensity})`);
            grad.addColorStop(0.7, `rgba(37, 99, 235, ${0.2 * state.intensity})`);
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");

            tempCtx.fillStyle = grad;
            tempCtx.fillRect(0, 0, width, height);

            // Draw the masked result on main canvas
            ctx.globalAlpha = 1.0;
            ctx.drawImage(tempCanvas, 0, 0);
          }
        } else if (isMobile) {
          // Subtle pulse on mobile
          const pulse = (Math.sin(time * 0.002) + 1) / 2; // 0 to 1
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext("2d");
          if (tempCtx) {
            tempCtx.drawImage(imageRef.current, 0, 0, width, height);
            tempCtx.globalCompositeOperation = "source-in";
            
            // Soft center glow
            const grad = tempCtx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width*0.4);
            grad.addColorStop(0, `rgba(37, 99, 235, ${0.2 + pulse * 0.15})`);
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");
            tempCtx.fillStyle = grad;
            tempCtx.fillRect(0, 0, width, height);
            
            ctx.globalAlpha = 1.0;
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }

        // 2. Draw outer circle light path (traveling glow effect around circular shape)
        const cx = width / 2;
        const cy = height / 2;
        const r = width * 0.415; // aligns with logo circular border
        const speed = 0.0015;
        const arcAngle = Math.PI / 4; // Length of traveling arc
        const currentAngle = (time * speed) % (Math.PI * 2);

        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, r, currentAngle, currentAngle + arcAngle);
        ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 + state.intensity * 0.75})`;
        ctx.lineWidth = isMobile ? 1.5 : 2.5;
        ctx.lineCap = "round";
        
        // Add subtle shadow glow
        if (!isMobile && state.intensity > 0.1) {
          ctx.shadowColor = "#2563EB";
          ctx.shadowBlur = 12 * state.intensity;
        }
        ctx.stroke();
        
        // Reset shadows
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [imgLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-72 h-72 md:w-96 md:h-96 mx-auto cursor-pointer transition-all duration-300 ease-out"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background glass radial glow */}
      <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-2xl pointer-events-none scale-75 animate-pulse-slow" />

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Fallback image (if canvas fails or during load) */}
      {!imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center border border-white/5 rounded-full bg-white/[0.01]">
          <div className="w-12 h-12 rounded-full border border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
