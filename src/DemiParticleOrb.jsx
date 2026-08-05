import { useEffect, useRef } from "react";
import { MODE_DRAWS, resolvePreset } from "thinking-orbs";

export function DemiParticleOrb({ state, preset = "large", paused = false, speed = 1, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const particleLayer = document.createElement("canvas");
    const particles = particleLayer.getContext("2d");
    const baseSize = preset === "compact" ? 20 : 64;
    const definition = resolvePreset(state, baseSize);
    let frame = 0;
    let last = performance.now();
    let elapsed = Math.random() * 2400;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      particleLayer.width = canvas.width;
      particleLayer.height = canvas.height;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = (now) => {
      const delta = Math.min(32, now - last);
      last = now;
      if (!paused) elapsed += delta * speed;

      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const target = Math.min(bounds.width, bounds.height) * (preset === "compact" ? 0.64 : 0.74);
      const x = (bounds.width - target) / 2;
      const y = (bounds.height - target) / 2;
      const pulse = 0.5 + Math.sin(elapsed * 0.0016) * 0.5;

      context.clearRect(0, 0, bounds.width, bounds.height);
      const aura = context.createRadialGradient(bounds.width / 2, bounds.height / 2, 0, bounds.width / 2, bounds.height / 2, target * 0.75);
      aura.addColorStop(0, `rgba(206,61,162,${0.1 + pulse * 0.035})`);
      aura.addColorStop(0.48, "rgba(36,108,224,0.05)");
      aura.addColorStop(0.78, "rgba(253,133,2,0.018)");
      aura.addColorStop(1, "rgba(4,1,32,0)");
      context.fillStyle = aura;
      context.fillRect(0, 0, bounds.width, bounds.height);

      particles.setTransform(1, 0, 0, 1, 0, 0);
      particles.clearRect(0, 0, particleLayer.width, particleLayer.height);
      particles.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.save();
      particles.translate(x, y);
      particles.scale(target / baseSize, target / baseSize);
      const scaledTime = (elapsed / 1000) * definition.speed;
      const drawTime = definition.mode === "morph" ? scaledTime % 6.899 : scaledTime;
      MODE_DRAWS[definition.mode](particles, baseSize, drawTime, true, definition.opts);
      particles.restore();

      particles.globalCompositeOperation = "source-in";
      const ink = particles.createLinearGradient(x, y, x + target, y + target);
      ink.addColorStop(0, "#ffffff");
      ink.addColorStop(0.25, "#246ce0");
      ink.addColorStop(0.56, "#ce3da2");
      ink.addColorStop(0.82, "#fd8502");
      ink.addColorStop(1, "#ffffff");
      particles.fillStyle = ink;
      particles.fillRect(0, 0, bounds.width, bounds.height);
      particles.globalCompositeOperation = "source-over";

      context.save();
      context.globalCompositeOperation = "screen";
      context.shadowColor = "rgba(206,61,162,0.26)";
      context.shadowBlur = preset === "compact" ? 4 : Math.max(6, target * 0.07);
      context.drawImage(particleLayer, 0, 0, bounds.width, bounds.height);
      context.restore();

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [paused, preset, speed, state]);

  return <canvas ref={canvasRef} className="demi-particle-orb" role="img" aria-label={label || `${state} cognition animation`} />;
}
