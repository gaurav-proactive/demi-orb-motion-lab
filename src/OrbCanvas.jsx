import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

function easeInOut(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function easeOut(value) {
  return 1 - Math.pow(1 - clamp(value), 3);
}

function traceOrbPath(ctx, radius, time, voice = 0, hold = 0) {
  const steps = 112;
  ctx.beginPath();
  for (let step = 0; step <= steps; step += 1) {
    const angle = (step / steps) * TAU;
    const equatorWeight = Math.pow(Math.abs(Math.cos(angle)), 7);
    const voiceShape = Math.sin(angle * 5 + time * 0.0055) * voice * 0.022 * equatorWeight;
    const holdShape = Math.sin(angle * 2 - time * 0.0018) * hold * 0.006;
    const localRadius = radius * (1 + voiceShape + holdShape);
    const x = Math.cos(angle) * localRadius;
    const y = Math.sin(angle) * localRadius;
    if (step === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawVoice(ctx, radius, time, amount, bands, colored, frequency = 2) {
  if (!amount) return;
  ctx.save();
  traceOrbPath(ctx, radius * 0.985, time, amount, 0);
  ctx.clip();
  const bandCount = bands || 3;
  const phase = time * (0.0032 + frequency * 0.00055);
  const ribbonTop = [];
  const ribbonBottom = [];
  for (let x = -radius; x <= radius; x += 3) {
    const envelope = Math.pow(Math.max(0, 1 - Math.pow(x / radius, 2)), 1.35);
    const center = (Math.sin(x * 0.064 + phase) + Math.sin(x * 0.027 - phase * 0.72) * 0.48) * radius * 0.082 * amount * envelope;
    const thickness = radius * (0.014 + amount * 0.022) * envelope;
    ribbonTop.push([x, center - thickness]);
    ribbonBottom.push([x, center + thickness]);
  }
  ctx.beginPath();
  ribbonTop.forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ribbonBottom.reverse().forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.closePath();
  ctx.fillStyle = colored ? "rgba(255,255,255,0.11)" : "rgba(206,61,162,0.15)";
  ctx.shadowColor = colored ? "rgba(255,255,255,0.32)" : "rgba(206,61,162,0.38)";
  ctx.shadowBlur = radius * 0.08;
  ctx.fill();

  for (let band = 0; band < bandCount; band += 1) {
    const offset = (band - (bandCount - 1) / 2) * radius * 0.115;
    ctx.beginPath();
    for (let x = -radius; x <= radius; x += 3) {
      const envelope = Math.pow(Math.max(0, 1 - Math.pow(x / radius, 2)), 1.45);
      const wave = Math.sin(x * (0.06 + frequency * 0.006) + phase + band * 1.2);
      const secondary = Math.sin(x * 0.029 - phase * 0.68) * 0.46;
      const y = offset + (wave + secondary) * radius * 0.105 * amount * envelope;
      if (x === -radius) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colored
      ? `rgba(255,255,255,${0.18 + band * 0.045})`
      : `rgba(206,61,162,${0.22 + band * 0.055})`;
    const centerBand = band === Math.floor(bandCount / 2);
    ctx.lineWidth = Math.max(centerBand ? 2.1 : 1.45, radius * (centerBand ? 0.018 : 0.012));
    ctx.lineCap = "round";
    ctx.stroke();
  }
  ctx.restore();
}

function drawHoldField(ctx, radius, time, amount) {
  if (!amount) return;
  const phase = (time * 0.00055) % TAU;
  const pulse = 0.5 + Math.sin(time * 0.0032) * 0.5;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.72);
  core.addColorStop(0, `rgba(206,61,162,${0.11 + pulse * 0.08})`);
  core.addColorStop(0.52, "rgba(36,108,224,0.045)");
  core.addColorStop(1, "rgba(4,1,32,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.74, 0, TAU);
  ctx.fill();

  for (let ring = 0; ring < 3; ring += 1) {
    const ringRadius = radius * (0.42 + ring * 0.17 + pulse * 0.018);
    const direction = ring % 2 === 0 ? 1 : -1;
    const start = phase * direction + ring * 1.7;
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, start, start + Math.PI * (0.58 + ring * 0.08));
    ctx.strokeStyle = ring === 1 ? "rgba(255,255,255,0.18)" : "rgba(206,61,162,0.27)";
    ctx.lineWidth = Math.max(1.4, radius * (0.012 + ring * 0.002));
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(206,61,162,0.34)";
    ctx.shadowBlur = radius * 0.05;
    ctx.stroke();
  }
  ctx.restore();
}

function drawAcknowledgement(ctx, radius, progress, amount) {
  if (!amount) return;
  const reveal = easeOut(progress / 0.46);
  const fade = 1 - easeInOut(clamp((progress - 0.28) / 0.58));
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let ring = 0; ring < 2; ring += 1) {
    const ringProgress = clamp(reveal - ring * 0.16);
    ctx.beginPath();
    ctx.arc(0, 0, radius * (1.03 + ringProgress * (0.32 + ring * 0.08)), 0, TAU);
    ctx.strokeStyle = ring === 0
      ? `rgba(255,255,255,${0.72 * fade * amount})`
      : `rgba(253,133,2,${0.46 * fade * amount})`;
    ctx.lineWidth = Math.max(1.4, radius * (0.019 - ring * 0.004));
    ctx.shadowColor = ring === 0 ? "rgba(255,255,255,0.7)" : "rgba(253,133,2,0.62)";
    ctx.shadowBlur = radius * 0.1;
    ctx.stroke();
  }
  const sweep = clamp(progress / 0.58);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.015, -Math.PI / 2, -Math.PI / 2 + TAU * sweep);
  ctx.strokeStyle = `rgba(255,255,255,${0.92 * (1 - sweep * 0.45) * amount})`;
  ctx.lineWidth = Math.max(2, radius * 0.025);
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

function drawFlow(ctx, radius, time, amount) {
  if (!amount) return;
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.96, 0, TAU);
  ctx.clip();
  for (let line = -2; line <= 2; line += 1) {
    const x = line * radius * 0.2;
    const shift = ((time * 0.035 + line * 37) % (radius * 2.4)) - radius * 1.2;
    const gradient = ctx.createLinearGradient(0, shift + radius * 0.55, 0, shift - radius * 0.55);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.48, `rgba(255,255,255,${0.1 + amount * 0.1})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.moveTo(x, shift + radius * 0.55);
    ctx.bezierCurveTo(x + radius * 0.1, shift + radius * 0.24, x - radius * 0.08, shift - radius * 0.24, x, shift - radius * 0.55);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, radius * 0.01);
    ctx.stroke();
  }
  ctx.restore();
}

function drawOrb(ctx, width, height, config, time, strength = 1) {
  const progress = ((time % config.durationMs) / config.durationMs + 1) % 1;
  const minSize = Math.min(width, height);
  const maxRadius = minSize * 0.33;
  let radiusFactor = config.radius;
  let halo = config.halo || 0;
  let opacity = config.opacity ?? 1;

  if (config.id === "proximity") {
    const min = config.interaction?.minRadius ?? 0.055;
    const max = config.interaction?.maxRadius ?? config.radius;
    radiusFactor = min + (max - min) * easeInOut(strength);
    opacity = 0.26 + strength * 0.68;
  }

  if (config.id === "resolve" && progress > 0.62) {
    const collapseProgress = easeInOut((progress - 0.62) / 0.38);
    radiusFactor = config.radius * (1 - collapseProgress) + 0.055 * collapseProgress;
    halo *= 1 - collapseProgress;
    opacity = 0.9 - collapseProgress * 0.52;
  }

  const breath = 1 + Math.sin(progress * TAU) * (config.breath || 0);
  const acknowledgementLift = config.acknowledgement
    ? 1 + Math.sin(clamp(progress / 0.62) * Math.PI) * 0.042
    : 1;
  const radius = maxRadius * (radiusFactor / 0.6) * breath * acknowledgementLift;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.globalAlpha = opacity;

  if (halo > 0) {
    const haloPulse = config.id === "resolve" ? 1 : 0.82 + Math.sin(progress * TAU) * 0.08;
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * (1.15 + ring * 0.15), 0, TAU);
      ctx.strokeStyle = `rgba(206,61,162,${halo * haloPulse * (0.22 - ring * 0.052)})`;
      ctx.lineWidth = Math.max(1.1, radius * (config.haloLineWidth || 0.011));
      ctx.stroke();
    }
  }

  const glow = ctx.createRadialGradient(0, radius * 0.18, radius * 0.12, 0, 0, radius * 1.55);
  glow.addColorStop(0, config.colorMode === "demi-gradient" ? "rgba(253,133,2,0.2)" : "rgba(206,61,162,0.1)");
  glow.addColorStop(1, "rgba(4,1,32,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.55, 0, TAU);
  ctx.fill();

  ctx.save();
  traceOrbPath(ctx, radius, time, config.voice || 0, config.hold || 0);
  ctx.clip();

  if (config.colorMode === "demi-gradient") {
    const colorReveal = config.acknowledgement ? easeOut((progress - 0.035) / 0.46) : 1;
    const underlay = ctx.createRadialGradient(-radius * 0.13, -radius * 0.18, radius * 0.04, 0, 0, radius);
    underlay.addColorStop(0, "rgba(93,75,151,0.58)");
    underlay.addColorStop(0.58, "rgba(30,19,70,0.88)");
    underlay.addColorStop(1, "rgba(4,1,32,0.98)");
    ctx.fillStyle = underlay;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.save();
    ctx.globalAlpha = colorReveal;
    const gradientShift = config.flow ? Math.sin(time * 0.00055) * radius * 0.16 : 0;
    const gradient = ctx.createLinearGradient(0, -radius + gradientShift, 0, radius + gradientShift);
    gradient.addColorStop(0, "#246CE0");
    gradient.addColorStop(0.46, "#CE3DA2");
    gradient.addColorStop(0.79, "#FD8502");
    gradient.addColorStop(1, "#FFFFFF");
    ctx.fillStyle = gradient;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    const membrane = ctx.createRadialGradient(0, radius * 0.06, radius * 0.18, 0, 0, radius);
    membrane.addColorStop(0, "rgba(4,1,32,0.02)");
    membrane.addColorStop(0.62, "rgba(4,1,32,0.13)");
    membrane.addColorStop(1, "rgba(4,1,32,0.72)");
    ctx.fillStyle = membrane;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    const core = ctx.createRadialGradient(0, radius * 0.82, 0, 0, radius * 0.78, radius * 0.5);
    core.addColorStop(0, "rgba(255,255,255,0.86)");
    core.addColorStop(0.35, "rgba(253,133,2,0.22)");
    core.addColorStop(1, "rgba(253,133,2,0)");
    ctx.fillStyle = core;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  } else {
    const monochrome = ctx.createRadialGradient(-radius * 0.13, -radius * 0.18, radius * 0.04, 0, 0, radius);
    monochrome.addColorStop(0, "rgba(93,75,151,0.58)");
    monochrome.addColorStop(0.58, "rgba(30,19,70,0.88)");
    monochrome.addColorStop(1, "rgba(4,1,32,0.98)");
    ctx.fillStyle = monochrome;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  }

  drawHoldField(ctx, radius, time, config.hold || 0);
  drawFlow(ctx, radius, time, config.flow || 0);
  drawVoice(ctx, radius, time, config.voice || 0, config.voiceBands, config.colorMode === "demi-gradient", config.voiceFrequency);
  ctx.restore();
  traceOrbPath(ctx, radius, time, config.voice || 0, config.hold || 0);
  ctx.strokeStyle = config.colorMode === "demi-gradient" ? "rgba(255,255,255,0.38)" : "rgba(167,139,250,0.32)";
  ctx.lineWidth = Math.max(1.15, radius * (config.rimWidth || 0.014));
  ctx.stroke();
  drawAcknowledgement(ctx, radius, progress, config.acknowledgement || 0);
  ctx.restore();
}

export function OrbCanvas({ config, className = "", strength = 1, paused = false, speed = 1, label }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config) return undefined;
    const context = canvas.getContext("2d");
    let frame = 0;
    let last = performance.now();
    let elapsed = Math.random() * config.durationMs;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const render = (now) => {
      const delta = Math.min(32, now - last);
      last = now;
      if (!paused) elapsed += delta * speed;
      const bounds = canvas.getBoundingClientRect();
      context.clearRect(0, 0, bounds.width, bounds.height);
      drawOrb(context, bounds.width, bounds.height, config, elapsed, strength);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [config, strength, paused, speed]);

  return <canvas ref={canvasRef} className={`orb-canvas ${className}`} role="img" aria-label={label || `${config?.label || "Demi"} orb animation`} />;
}
