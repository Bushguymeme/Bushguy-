/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { BushMomentId } from '../types.ts';

interface ParticleCanvasProps {
  momentId: BushMomentId;
}

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  char?: string;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  maxLife?: number;
  life?: number;
}

interface SlashLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  maxLife: number;
  width: number;
}

export default function ParticleCanvas({ momentId }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const slashesRef = useRef<SlashLine[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    // Adjust canvas sizes
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Slash trigger on click
    const handleCanvasClick = (e: MouseEvent) => {
      if (momentId !== 'slashing') return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Add 2 random slash lines
      for (let i = 0; i < 2; i++) {
        const length = 120 + Math.random() * 100;
        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // slightly diagonal
        slashesRef.current.push({
          x1: clickX - (length / 2) * Math.cos(angle),
          y1: clickY - (length / 2) * Math.sin(angle),
          x2: clickX + (length / 2) * Math.cos(angle),
          y2: clickY + (length / 2) * Math.sin(angle),
          life: 15,
          maxLife: 15,
          width: 3 + Math.random() * 4,
        });
      }

      // Spawn extra particles at click point
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: clickX,
          y: clickY,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: 14 + Math.random() * 12,
          char: Math.random() > 0.5 ? '$' : 'SOL',
          color: Math.random() > 0.4 ? '#14F195' : '#9945FF',
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          opacity: 1,
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    // Initial item spawns based on active mode
    const initParticles = () => {
      particles = [];
      const count = momentId === 'chilling' ? 40 : 25;
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(true));
      }
    };

    const createParticle = (randomY = false): Particle => {
      const w = canvas.width;
      const h = canvas.height;
      
      let x = Math.random() * w;
      let y = randomY ? Math.random() * h : -20;
      
      let vx = (Math.random() - 0.5) * 1.5;
      let vy = 1.2 + Math.random() * 2.5;
      let size = 12 + Math.random() * 16;
      let color = '#ffffff';
      let char = '';
      let rotation = Math.random() * Math.PI * 2;
      let rotationSpeed = (Math.random() - 0.5) * 0.05;
      let opacity = 0.4 + Math.random() * 0.5;

      switch (momentId) {
        case 'chilling':
          // Glowing embers rise from bottom
          y = randomY ? Math.random() * h : h + 10;
          vy = -0.5 - Math.random() * 1.5;
          vx = (Math.random() - 0.5) * 1.0;
          size = 3 + Math.random() * 5;
          color = Math.random() > 0.5 ? '#ff7a00' : '#ffa800';
          opacity = 0.5 + Math.random() * 0.5;
          break;

        case 'slashing':
          // Falling dollar signs and SOL coins
          char = Math.random() > 0.5 ? '$' : 'SOL';
          color = Math.random() > 0.45 ? '#14F195' : '#9945FF';
          vy = 2 + Math.random() * 4;
          size = 14 + Math.random() * 12;
          break;

        case 'ferrari':
          // Speed lines traveling left to right horizontally OR mud splatters
          if (Math.random() > 0.6) {
            // Mud splatter
            char = '🟤';
            vy = 1 + Math.random() * 2;
            vx = -2 - Math.random() * 4;
            color = '#8b5a2b';
            size = 8 + Math.random() * 15;
          } else {
            // Fast horizontal wind streaks
            y = Math.random() * h;
            x = w + 10;
            vx = -12 - Math.random() * 10;
            vy = (Math.random() - 0.5) * 0.5;
            size = 20 + Math.random() * 30; // length of wind line
            color = 'rgba(255,255,255,0.18)';
            char = 'LINE';
          }
          break;

        case 'swimming':
          // Rising bubbles and petals
          if (Math.random() > 0.5) {
            char = '🫧';
            y = h + 10;
            vy = -1 - Math.random() * 2;
            vx = (Math.random() - 0.5) * 1.5;
            size = 10 + Math.random() * 18;
            opacity = 0.3 + Math.random() * 0.4;
          } else {
            char = '🌸'; // hibiscus / frangipani / pink floral vibes
            vy = 1 + Math.random() * 1.5;
            size = 14 + Math.random() * 12;
            opacity = 0.6 + Math.random() * 0.4;
          }
          break;

        case 'flexing':
          // Gold bars, shiny coins, diamonds helper
          const options = ['🪙', '💎', '👑', '💪', '💰'];
          char = options[Math.floor(Math.random() * options.length)];
          vy = 1.5 + Math.random() * 3;
          size = 15 + Math.random() * 15;
          break;
      }

      return { x, y, vy, vx, size, char, color, rotation, rotationSpeed, opacity };
    };

    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw active campfire glow for chilling
      if (momentId === 'chilling') {
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height - 20,
          10,
          canvas.width / 2,
          canvas.height - 20,
          canvas.width / 2
        );
        grad.addColorStop(0, 'rgba(255, 120, 0, 0.08)');
        grad.addColorStop(0.5, 'rgba(120, 50, 0, 0.03)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Draw Slash lines (from machete clicks in slashing mode)
      if (momentId === 'slashing') {
        slashesRef.current.forEach((slash, idx) => {
          const ratio = slash.life / slash.maxLife;
          ctx.strokeStyle = `rgba(255, 255, 255, ${ratio})`;
          ctx.lineWidth = slash.width * ratio;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(slash.x1, slash.y1);
          ctx.lineTo(slash.x2, slash.y2);
          ctx.stroke();

          // Slash blade sheen back-glow
          ctx.strokeStyle = `rgba(20, 241, 149, ${ratio * 0.35})`;
          ctx.lineWidth = slash.width * 2.5 * ratio;
          ctx.stroke();

          slash.life -= 1;
        });

        // Filter finished slashes
        slashesRef.current = slashesRef.current.filter((s) => s.life > 0);
      }

      // 3. Move and draw particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Custom behaviors per type
        if (momentId === 'chilling') {
          // Ember drift wobble
          p.vx += (Math.random() - 0.5) * 0.15;
          // Slowly fade out as they reach top
          p.opacity = Math.max(0, p.opacity - 0.001);
        } else if (momentId === 'swimming' && p.char === '🫧') {
          // Sine wave ripple rise for bubbles
          p.vx = Math.sin(p.y / 25) * 1.2;
        }

        // Keep inside bounds or reset
        const outOfBounds = 
          p.y > canvas.height + 40 || 
          p.y < -40 || 
          p.x > canvas.width + 40 || 
          p.x < -40;

        if (outOfBounds || p.opacity <= 0) {
          particles[index] = createParticle();
        }

        // Draw particle representation
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.char === 'LINE') {
          // Wind streak
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -1.5, p.size, 3);
        } else if (p.char) {
          // Draw Emoji or Character string
          ctx.font = `${p.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          if (p.char === 'SOL') {
            // Render styled SOL tag
            ctx.fillStyle = '#14F195';
            ctx.font = `bold ${p.size * 0.8}px monospace`;
            ctx.fillText('SOL', 0, 0);
            
            // Neon circle backing for SOL text
            ctx.strokeStyle = 'rgba(153, 69, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.fillStyle = p.color;
            ctx.fillText(p.char, 0, 0);
          }
        } else {
          // Circular fire/gold spark
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Subtle neon light radial back-shadow
          const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
          glowGrad.addColorStop(0, p.color);
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationId);
    };
  }, [momentId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
      id="moment-physics-layer"
    />
  );
}
