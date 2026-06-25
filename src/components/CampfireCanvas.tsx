import { useEffect, useRef, useState } from 'react';
import { Flame, Sparkles, Plus } from 'lucide-react';
import { bushSynth } from '../utils/audio.ts';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
  color: string;
  type: 'flame' | 'smoke' | 'ember';
  swaySpeed: number;
  swayOffset: number;
}

export default function CampfireCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Stateful campfire logs setup
  const [logCount, setLogCount] = useState(3);
  const logCountRef = useRef(3);
  const [woodInventory, setWoodInventory] = useState(4);
  const [totalChops, setTotalChops] = useState(0);

  // Spark burst trigger
  const burstTriggerRef = useRef(0);

  // Sync state and ref
  const syncLogCount = (count: number) => {
    setLogCount(count);
    logCountRef.current = count;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 400,
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Automatic slow decay of firewood logs over time (burning down)
  useEffect(() => {
    const interval = setInterval(() => {
      if (logCountRef.current > 1) {
        const next = logCountRef.current - 1;
        syncLogCount(next);
      }
    }, 28000); // 1 log burns out every 28 seconds

    return () => clearInterval(interval);
  }, []);

  // Primary animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let glowIntensity = 1.0;
    let glowDirection = 1;

    // Fire parameters base
    const baseWidth = 80;
    const baseHeight = 15;

    const createParticle = (type: 'flame' | 'smoke' | 'ember', customX?: number, customY?: number): Particle => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height - 110;

      // Random starting point within fire pit area
      const x = customX !== undefined ? customX : centerX + (Math.random() - 0.5) * baseWidth;
      const y = customY !== undefined ? customY : centerY + (Math.random() - 0.5) * baseHeight;

      const scale = 0.5 + logCountRef.current * 0.16;

      if (type === 'flame') {
        const maxLife = (35 + Math.random() * 35) * (0.8 + logCountRef.current * 0.1);
        return {
          x,
          y,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (-1.8 - Math.random() * 3.2) * (0.7 + logCountRef.current * 0.12),
          size: (12 + Math.random() * 18) * scale,
          life: maxLife,
          maxLife,
          alpha: 1.0,
          color: '', // set dynamically
          type,
          swaySpeed: 0.04 + Math.random() * 0.05,
          swayOffset: Math.random() * Math.PI * 2,
        };
      } else if (type === 'ember') {
        const maxLife = (70 + Math.random() * 70) * (0.9 + logCountRef.current * 0.05);
        return {
          x,
          y: y - 15,
          vx: (Math.random() - 0.5) * 2.8,
          vy: (-1.2 - Math.random() * 2.8) * (0.8 + logCountRef.current * 0.08),
          size: (1.2 + Math.random() * 2.2) * (0.8 + logCountRef.current * 0.08),
          life: maxLife,
          maxLife,
          alpha: 1.0,
          color: '', // set dynamically
          type,
          swaySpeed: 0.02 + Math.random() * 0.03,
          swayOffset: Math.random() * Math.PI * 2,
        };
      } else {
        // Smoke
        const maxLife = 90 + Math.random() * 90;
        return {
          x,
          y: y - 35,
          vx: (Math.random() - 0.5) * 1.0,
          vy: -0.8 - Math.random() * 1.2,
          size: (16 + Math.random() * 20) * scale,
          life: maxLife,
          maxLife,
          alpha: 0.25,
          color: '',
          type,
          swaySpeed: 0.015 + Math.random() * 0.02,
          swayOffset: Math.random() * Math.PI * 2,
        };
      }
    };

    const drawLogs = (cx: number, cy: number) => {
      ctx.save();
      
      // Shadow under logs scales with log pile
      ctx.beginPath();
      ctx.ellipse(cx, cy + 25, 80 + logCountRef.current * 6, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fill();

      // Log 1 (Back Left) - active at >= 1 log
      if (logCountRef.current >= 1) {
        ctx.save();
        ctx.translate(cx - 30, cy + 10);
        ctx.rotate(-Math.PI / 8);
        drawLogShape(75, 16, '#3a2010', '#1c0f07');
        ctx.restore();
      }

      // Log 2 (Back Right) - active at >= 2 logs
      if (logCountRef.current >= 2) {
        ctx.save();
        ctx.translate(cx + 34, cy + 11);
        ctx.rotate(Math.PI / 7);
        drawLogShape(78, 15, '#3d2212', '#1c0f07');
        ctx.restore();
      }

      // Log 3 (Front Centerpiece) - active at >= 3 logs
      if (logCountRef.current >= 3) {
        ctx.save();
        ctx.translate(cx, cy + 17);
        ctx.rotate(-Math.PI / 36);
        drawLogShape(88, 18, '#4d2b18', '#26140a');
        
        // Ember glow on centerpiece log
        const logGradient = ctx.createRadialGradient(0, 0, 4, 0, 0, 40);
        logGradient.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
        logGradient.addColorStop(0.35, 'rgba(249, 115, 22, 0.45)');
        logGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = logGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 42, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Log 4 (Cross Left) - active at >= 4 logs
      if (logCountRef.current >= 4) {
        ctx.save();
        ctx.translate(cx - 18, cy + 3);
        ctx.rotate(Math.PI / 4.2);
        drawLogShape(72, 14, '#442615', '#221108');
        ctx.restore();
      }

      // Log 5 (Cross Right) - active at >= 5 logs
      if (logCountRef.current >= 5) {
        ctx.save();
        ctx.translate(cx + 22, cy + 2);
        ctx.rotate(-Math.PI / 5.2);
        drawLogShape(74, 13, '#3e2111', '#1e0f07');
        ctx.restore();
      }

      // Log 6 (Top centerpiece) - active at 6 logs
      if (logCountRef.current >= 6) {
        ctx.save();
        ctx.translate(cx, cy - 6);
        ctx.rotate(Math.PI / 24);
        drawLogShape(84, 16, '#56311b', '#2c170c');
        
        // Vibrant hot core glow on top log
        const topLogGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, 26);
        topLogGrad.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
        topLogGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.55)');
        topLogGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topLogGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 26, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    const drawLogShape = (w: number, h: number, col1: string, col2: string) => {
      // Main log bark
      const grad = ctx.createLinearGradient(-w/2, -h/2, -w/2, h/2);
      grad.addColorStop(0, col1);
      grad.addColorStop(0.5, '#2c180c');
      grad.addColorStop(1, col2);
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, 4);
      ctx.fill();

      // End cut circles
      ctx.fillStyle = '#61371c';
      ctx.beginPath();
      ctx.ellipse(w/2, 0, h/2, h/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#221106';
      ctx.beginPath();
      ctx.ellipse(w/2, 0, h/3, h/3, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawCampfireBaseStones = (cx: number, cy: number) => {
      const stones = [
        { ox: -105, oy: 22, r: 16, color: '#383838' },
        { ox: -75, oy: 28, r: 14, color: '#4a4a4a' },
        { ox: -40, oy: 33, r: 15, color: '#2b2b2b' },
        { ox: 0, oy: 35, r: 18, color: '#3f3f3f' },
        { ox: 45, oy: 32, r: 15, color: '#2e2e2e' },
        { ox: 80, oy: 26, r: 14, color: '#4d4d4d' },
        { ox: 108, oy: 19, r: 17, color: '#333333' },
      ];

      stones.forEach(stone => {
        ctx.save();
        const stoneGrad = ctx.createRadialGradient(
          cx + stone.ox - stone.r/3, cy + stone.oy - stone.r/3, stone.r/10,
          cx + stone.ox, cy + stone.oy, stone.r
        );
        stoneGrad.addColorStop(0, '#585858');
        stoneGrad.addColorStop(0.4, stone.color);
        stoneGrad.addColorStop(1, '#1b1b1b');

        ctx.fillStyle = stoneGrad;
        ctx.beginPath();
        ctx.arc(cx + stone.ox, cy + stone.oy, stone.r, 0, Math.PI * 2);
        ctx.fill();

        // Reflected campfire light on stones
        const reflectVal = 0.15 + logCountRef.current * 0.08;
        const highlightGrad = ctx.createRadialGradient(
          cx + stone.ox, cy + stone.oy - 4, 1,
          cx + stone.ox, cy + stone.oy - 4, stone.r
        );
        highlightGrad.addColorStop(0, `rgba(249, 115, 22, ${0.45 * reflectVal})`);
        highlightGrad.addColorStop(0.2, `rgba(239, 68, 68, ${0.15 * reflectVal})`);
        highlightGrad.addColorStop(0.6, 'rgba(0,0,0,0)');
        ctx.fillStyle = highlightGrad;
        ctx.beginPath();
        ctx.arc(cx + stone.ox, cy + stone.oy, stone.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const cx = dimensions.width / 2;
      const cy = dimensions.height - 110;

      // Glow pulse
      glowIntensity += glowDirection * 0.007;
      if (glowIntensity > 1.12) glowDirection = -1;
      if (glowIntensity < 0.88) glowDirection = 1;

      // Multipliers based on active logs
      const fireIntensityScale = 0.4 + logCountRef.current * 0.22; // 1 log = 0.62x, 3 logs = 1.06x, 6 logs = 1.72x
      const glowScaleRadius = 120 + logCountRef.current * 30;

      // Trigger burst particles on firewood throws
      if (burstTriggerRef.current > 0) {
        glowIntensity = 2.4; // spike glow instantly
        // Inject multiple intense fire & sparks
        for (let i = 0; i < 40; i++) {
          particles.push(createParticle('ember', cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 10));
        }
        for (let i = 0; i < 25; i++) {
          particles.push(createParticle('flame', cx + (Math.random() - 0.5) * 50, cy + (Math.random() - 0.5) * 12));
        }
        burstTriggerRef.current = 0; // reset
      }

      // 1. Large background warm fire glow
      const bgGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, glowScaleRadius * 1.5);
      bgGlow.addColorStop(0, `rgba(249, 115, 22, ${0.17 * glowIntensity * fireIntensityScale})`);
      bgGlow.addColorStop(0.45, `rgba(239, 68, 68, ${0.07 * glowIntensity * fireIntensityScale})`);
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowScaleRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ground floor glow reflection
      const floorGlow = ctx.createRadialGradient(cx, cy + 18, 5, cx, cy + 18, glowScaleRadius * 0.85);
      floorGlow.addColorStop(0, `rgba(251, 146, 60, ${0.36 * glowIntensity * fireIntensityScale})`);
      floorGlow.addColorStop(0.5, `rgba(239, 68, 68, ${0.12 * glowIntensity * fireIntensityScale})`);
      floorGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.scale(1, 0.25);
      ctx.fillStyle = floorGlow;
      ctx.beginPath();
      ctx.arc(cx, (cy + 18) * 4, glowScaleRadius * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Spawning particles (Cap them dynamically based on log counts)
      const maxFlames = 12 + logCountRef.current * 16;
      const maxEmbers = 10 + logCountRef.current * 8;
      const maxSmoke = 5 + logCountRef.current * 4;

      if (particles.filter(p => p.type === 'flame').length < maxFlames) {
        particles.push(createParticle('flame'));
      }
      if (Math.random() < (0.08 + logCountRef.current * 0.04) && particles.filter(p => p.type === 'ember').length < maxEmbers) {
        particles.push(createParticle('ember'));
      }
      if (Math.random() < 0.07 && particles.filter(p => p.type === 'smoke').length < maxSmoke) {
        particles.push(createParticle('smoke'));
      }

      // Render/update all particles
      particles.forEach((p, index) => {
        p.life -= 1;
        if (p.life <= 0) {
          particles.splice(index, 1);
          return;
        }

        const ageRatio = p.life / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;

        // Soft natural air wave sway
        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * 0.45;

        if (p.type === 'flame') {
          // Flame colors: Core hot yellow -> orange -> crimson tip
          let r = 255;
          let g = 0;
          let b = 0;

          if (ageRatio > 0.72) {
            const factor = (ageRatio - 0.72) / 0.28;
            g = Math.floor(190 + factor * 65);
            b = Math.floor(90 + factor * 165);
          } else if (ageRatio > 0.38) {
            const factor = (ageRatio - 0.38) / 0.34;
            g = Math.floor(80 + factor * 110);
            b = Math.floor(10 + factor * 35);
          } else if (ageRatio > 0.12) {
            const factor = (ageRatio - 0.12) / 0.26;
            g = Math.floor(25 + factor * 55);
          } else {
            g = Math.floor(ageRatio * 150);
          }

          p.alpha = Math.max(0, ageRatio * 1.15);
          p.color = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;

          const size = p.size * (0.32 + 0.68 * ageRatio);

          const fireGrad = ctx.createRadialGradient(p.x, p.y, size * 0.1, p.x, p.y, size);
          fireGrad.addColorStop(0, p.color);
          fireGrad.addColorStop(0.4, `rgba(${r}, ${Math.max(0, g - 45)}, ${Math.max(0, b - 20)}, ${p.alpha * 0.65})`);
          fireGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = fireGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'ember') {
          p.alpha = Math.max(0, ageRatio);
          
          let r = 255;
          let g = Math.floor(110 + ageRatio * 145);
          let b = Math.floor(10 + ageRatio * 50);
          p.color = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;

          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(249, 115, 22, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

        } else if (p.type === 'smoke') {
          p.alpha = Math.max(0, ageRatio * 0.2);
          p.color = `rgba(34, 30, 28, ${p.alpha})`;

          const size = p.size * (1.0 + (1 - ageRatio) * 1.1);

          const smokeGrad = ctx.createRadialGradient(p.x, p.y, size * 0.05, p.x, p.y, size);
          smokeGrad.addColorStop(0, p.color);
          smokeGrad.addColorStop(0.5, `rgba(18, 16, 15, ${p.alpha * 0.45})`);
          smokeGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = smokeGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Draw wood logs setup dynamically
      drawLogs(cx, cy);

      // 5. Rocks perimeter circle
      drawCampfireBaseStones(cx, cy);

      // 6. Radiant hot base embers core (glares white and golden)
      const coreRadius = 25 + logCountRef.current * 5;
      const centerCore = ctx.createRadialGradient(cx, cy + 9, 2, cx, cy + 9, coreRadius);
      centerCore.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      centerCore.addColorStop(0.2, 'rgba(254, 240, 138, 0.85)');
      centerCore.addColorStop(0.6, `rgba(249, 115, 22, ${0.45 + logCountRef.current * 0.05})`);
      centerCore.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerCore;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 9, coreRadius, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Trigger explosive sparks splash on clicking canvas
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (let i = 0; i < 35; i++) {
        particles.push(createParticle('ember', clickX, clickY));
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleClick);
    };
  }, [dimensions]);

  // Click handler for wood slashing (Machete Wood Chopping)
  const handleChopWood = () => {
    setWoodInventory(prev => Math.min(12, prev + 1));
    setTotalChops(prev => prev + 1);
    bushSynth.triggerChopWood();
  };

  // Click handler for throwing log on fire
  const handleAddLog = () => {
    if (woodInventory <= 0) return;
    if (logCount >= 6) return;

    setWoodInventory(prev => prev - 1);
    const nextLogs = logCount + 1;
    syncLogCount(nextLogs);
    
    // Trigger splash
    burstTriggerRef.current = 1;

    // Trigger sound
    bushSynth.triggerWoodThrow();
  };

  // Compute stats based on logs count
  const getFireStatus = () => {
    switch (logCount) {
      case 6: return { title: '🔥 ROARING BEACON', desc: 'Sizzling heat and infinite hold conviction.', temp: '980°C', color: 'text-amber-400' };
      case 5: return { title: '🔥 ROARING HEARTH', desc: 'Massive, healthy crackling warmth.', temp: '820°C', color: 'text-orange-400' };
      case 4: return { title: '🔥 VIBRANT CAMPFIRE', desc: 'Bright, lively logs feeding the chart.', temp: '660°C', color: 'text-orange-500' };
      case 3: return { title: '🪵 COZY CAMPFIRE', desc: 'Standard comfortable bush-camp burn.', temp: '520°C', color: 'text-stone-300' };
      case 2: return { title: '🪵 GENTLE FLICKER', desc: 'Mild flame, starting to simmer down.', temp: '340°C', color: 'text-stone-400' };
      default: return { title: '✨ SMOLDERING EMBERS', desc: 'Dwindling. Slashes are needed! Add logs!', temp: '160°C', color: 'text-rose-400 font-bold animate-pulse' };
    }
  };

  const status = getFireStatus();

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Main visual Canvas container */}
      <div ref={containerRef} className="w-full relative flex items-center justify-center cursor-pointer">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block bg-gradient-to-b from-[#020502]/85 to-[#070b07]/95 rounded-2xl border border-emerald-950/25 relative z-10"
        />
        
        {/* Click helper tooltip */}
        <div className="absolute top-4 left-4 bg-emerald-950/85 border border-emerald-800/40 px-3 py-1 rounded-full text-[10px] font-mono text-solana-green/90 uppercase tracking-wider backdrop-blur-md z-20 pointer-events-none select-none">
          💥 Poke Fire for Spark Burst
        </div>

        {/* Dynamic Watermark overlay of active logs pile */}
        <div className="absolute top-4 right-4 bg-black/75 border border-orange-500/25 px-3.5 py-1.5 rounded-xl flex items-center gap-2 z-20 pointer-events-none">
          <div className="flex gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-3.5 rounded-sm transition-all ${
                  i < logCount 
                    ? 'bg-gradient-to-t from-orange-600 to-amber-400 border border-orange-500/30' 
                    : 'bg-stone-800 border border-stone-700/40 opacity-30'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-stone-400">{logCount}/6 Logs</span>
        </div>
      </div>

      {/* 2. Interactive Firewood Status and Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch relative z-20">
        
        {/* Fire stats segment */}
        <div className="md:col-span-5 bg-stone-950/50 border border-stone-800/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">
              HEARTH TEMPERATURE & STATE
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-sm font-display font-bold tracking-tight uppercase ${status.color}`}>
                {status.title}
              </span>
              <span className="text-xl font-mono font-bold text-amber-500">{status.temp}</span>
            </div>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              {status.desc}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-900 flex justify-between items-center text-[11px] font-mono text-stone-500">
            <span>Slashes with Machete: <strong className="text-stone-300">{totalChops}</strong></span>
            <span>Est. Burn Rate: <strong className="text-orange-500/80">Low</strong></span>
          </div>
        </div>

        {/* Dynamic inventory segment and Action buttons */}
        <div className="md:col-span-7 bg-stone-950/50 border border-stone-800/60 rounded-xl p-4 flex flex-col justify-between gap-4">
          
          {/* Inventory visual logs row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                YOUR WOODPILE INVENTORY
              </span>
              <span className="text-xs font-semibold text-stone-300 mt-0.5">
                {woodInventory > 0 ? `${woodInventory} logs stacked & dry` : 'Out of firewood! Chop some now!'}
              </span>
            </div>

            {/* Inventory logs icons stacked */}
            <div className="flex gap-1.5 items-center bg-black/40 border border-stone-900 px-3 py-1.5 rounded-lg min-h-[38px]">
              {woodInventory === 0 ? (
                <span className="text-[10px] font-mono text-stone-600 italic">No Wood</span>
              ) : (
                Array.from({ length: Math.min(8, woodInventory) }).map((_, i) => (
                  <span key={i} className="text-base select-none animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                    🪵
                  </span>
                ))
              )}
              {woodInventory > 8 && (
                <span className="text-xs font-mono text-amber-500 font-bold">+{woodInventory - 8}</span>
              )}
            </div>
          </div>

          {/* Action buttons grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Action 1: Chop wood */}
            <button
              onClick={handleChopWood}
              className="group flex flex-col items-center justify-center py-2 px-3 bg-emerald-950/20 hover:bg-emerald-900/35 border border-emerald-900/30 active:border-emerald-700/50 rounded-xl transition-all cursor-pointer select-none text-center h-14"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 tracking-wide uppercase transition-colors">
                <span>🪓 SLASH FOR WOOD</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-600/90 group-hover:text-emerald-500/90 transition-colors mt-0.5">
                Chop log with machete (+1 log)
              </span>
            </button>

            {/* Action 2: Throw wood on fire */}
            <button
              onClick={handleAddLog}
              disabled={woodInventory <= 0 || logCount >= 6}
              className={`group flex flex-col items-center justify-center py-2 px-3 border rounded-xl transition-all select-none text-center h-14 ${
                woodInventory <= 0
                  ? 'bg-stone-900/20 border-stone-800/40 opacity-40 cursor-not-allowed'
                  : logCount >= 6
                  ? 'bg-stone-900/30 border-stone-800/50 cursor-not-allowed text-stone-500'
                  : 'bg-amber-950/20 hover:bg-amber-900/35 border-amber-900/35 active:border-amber-700/50 text-amber-400 hover:text-amber-300 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
                <Flame className={`w-3.5 h-3.5 ${logCount < 6 && woodInventory > 0 ? 'animate-pulse text-amber-400' : ''}`} />
                <span>{logCount >= 6 ? 'FIRE FULL' : 'THROW LOG ON FIRE'}</span>
              </div>
              <span className="text-[9px] font-mono text-amber-600/90 group-hover:text-amber-500/90 mt-0.5">
                {logCount >= 6 ? 'Hearth is at maximum capacity' : 'Consumes 1 stacked log'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
