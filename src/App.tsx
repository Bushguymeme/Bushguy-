/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Flame,
  Shield,
  TrendingUp,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Copy,
  ExternalLink,
  Check,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Coins,
  Heart,
  Droplet,
  Car,
  Github
} from 'lucide-react';
import { BUSH_MOMENTS, EARLY_MATH_DATA, ROADMAP_DATA, FAQ_DATA, CONTRACT_ADDRESS, BUSH_GUY_IMAGES } from './data.ts';
import { BushMomentId } from './types.ts';
import ParticleCanvas from './components/ParticleCanvas.tsx';
import CampfireCanvas from './components/CampfireCanvas.tsx';
import { bushSynth } from './utils/audio.ts';

export default function App() {
  const [activeMomentId, setActiveMomentId] = useState<BushMomentId>('chilling');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [solInvestment, setSolInvestment] = useState<number>(5); // Default 5 SOL
  
  // Custom states for notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Dynamic Sol Price states tracking from CoinGecko
  const [solPrice, setSolPrice] = useState<number>(148.5);
  const [isPriceFetching, setIsPriceFetching] = useState<boolean>(false);
  const [priceSource, setPriceSource] = useState<'coingecko' | 'fallback'>('fallback');

  const fetchSolPrice = async (isManual = false) => {
    setIsPriceFetching(true);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      if (!response.ok) throw new Error('Failed to fetch from CoinGecko');
      const data = await response.json();
      if (data && data.solana && typeof data.solana.usd === 'number') {
        const newPrice = data.solana.usd;
        setSolPrice(newPrice);
        setPriceSource('coingecko');
        if (isManual) {
          showNotification(`📈 Live price synced from CoinGecko: $${newPrice.toFixed(2)} USD!`);
        }
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.warn('Could not fetch real-time SOL price from CoinGecko, trying Binance fallback:', err);
      try {
        const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
        if (binanceResponse.ok) {
          const binanceData = await binanceResponse.json();
          if (binanceData && binanceData.price) {
            const parsedPrice = parseFloat(binanceData.price);
            if (!isNaN(parsedPrice)) {
              setSolPrice(parsedPrice);
              setPriceSource('coingecko');
              if (isManual) {
                showNotification(`📈 Live backup price synced from Binance: $${parsedPrice.toFixed(2)} USD!`);
              }
              return;
            }
          }
        }
      } catch (binanceErr) {
        console.warn('Binance backup price fetch failed:', binanceErr);
      }

      setPriceSource('fallback');
      if (isManual) {
        showNotification('⚠️ Price feeds busy. Standard campfire valuation active.');
      }
    } finally {
      setIsPriceFetching(false);
    }
  };

  useEffect(() => {
    fetchSolPrice(false);
    // Refresh price every 60 seconds
    const interval = setInterval(() => {
      fetchSolPrice(false);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Find active moment
  const activeMoment = BUSH_MOMENTS.find((m) => m.id === activeMomentId) || BUSH_MOMENTS[0];

  // Initialize and handle sound parameters when moment id change
  useEffect(() => {
    if (isAudioEnabled) {
      bushSynth.init();
      bushSynth.setMoment(activeMomentId);
    }
  }, [activeMomentId, isAudioEnabled]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      bushSynth.stop();
    };
  }, []);

  const toggleAudio = () => {
    if (isAudioEnabled) {
      bushSynth.stop();
      setIsAudioEnabled(false);
      showNotification('🔇 Campfire crackles & ambient beats muted');
    } else {
      setIsAudioEnabled(true);
      // Give browser half-second to yield AudioContext
      setTimeout(() => {
        bushSynth.init();
        bushSynth.setMoment(activeMomentId);
        showNotification('🔥 Campfire is burning! Continuous crackles & ambient beats active!');
      }, 50);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        showNotification('📋 Solana Contract Address copied to clipboard!');
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } else {
        showNotification('⚠️ Could not copy contract. Please copy manually!');
      }
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      showNotification('⚠️ Could not copy contract. Please copy manually!');
    }
  };

  const copyContractToClipboard = () => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(CONTRACT_ADDRESS)
        .then(() => {
          setCopied(true);
          showNotification('📋 Solana Contract Address copied to clipboard!');
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          fallbackCopyText(CONTRACT_ADDRESS);
        });
    } else {
      fallbackCopyText(CONTRACT_ADDRESS);
    }
  };

  // Math calculated outputs
  const calculatedTokens = solInvestment * 10000000; // 10 Million BushGuy per Sol
  
  // Trigger specific moments for demo
  const switchMoment = (id: BushMomentId) => {
    setActiveMomentId(id);
    showNotification(`🌌 Switched sandbox scene to ${id.toUpperCase()} MOMENT!`);
  };

  return (
    <div className="min-h-screen bg-jungle-950 text-stone-100 font-sans selection:bg-solana-green selection:text-jungle-950 relative overflow-x-hidden jungle-grid">
      
      {/* Top Banner alert notifying on 100% fair decentralized setup */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#122b13] to-emerald-950 border-b border-emerald-900/40 py-2.5 px-4 text-center text-xs relative z-50">
        <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
          <span className="flex h-2 w-2 rounded-full bg-solana-green animate-pulse" />
          <strong className="text-solana-green font-semibold">ECO-SYSTEM ALERT:</strong> 1,000,000,000 $BUSHGUY. 100% Locked Liquidity & LP Burned on Raydium. No Pre-allocations! 🌾
        </span>
      </div>

      {/* Floating Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 border border-solana-green/40 px-5 py-3 rounded-xl shadow-2xl text-sm text-center flex items-center gap-2 font-mono text-solana-green glow-green"
          >
            <Zap className="w-4 h-4 text-solana-green animate-bounce" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 relative z-40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-jungle-900/60 backdrop-blur-md border border-emerald-900/40 p-4 rounded-2xl">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-solana-green/20 rounded-full blur-sm" />
              <img
                src={BUSH_GUY_IMAGES.logo}
                alt="Bush Guy Avatar"
                className="w-12 h-12 rounded-full border-2 border-solana-green relative z-10 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
                BUSH GUY <span className="text-xs px-2.5 py-0.5 rounded-full bg-solana-green/10 text-solana-green border border-solana-green/20">SOLANA MEME</span>
              </h2>
              <p className="font-mono text-xs text-stone-400">Ticker: $BUSHGUY</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Audio Widget Synth Console */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                isAudioEnabled
                  ? 'bg-solana-green/10 text-solana-green border-solana-green/40'
                  : 'bg-stone-900/80 text-stone-400 border-zinc-800 hover:border-zinc-700'
              }`}
              title="Toggle retro live synthesized musical beats!"
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse text-solana-green" />
                  <span className="flex items-center gap-1.5">
                    CAMPFIRE BEATS: PLAYING
                    <span className="flex gap-0.5 items-end h-3 w-5 pb-0.5">
                      <span className="w-0.5 bg-solana-green animate-[float_1s_infinite]" style={{ height: '60%' }} />
                      <span className="w-0.5 bg-solana-green animate-[float_0.7s_infinite]" style={{ height: '100%' }} />
                      <span className="w-0.5 bg-solana-green animate-[float_1.2s_infinite]" style={{ height: '40%' }} />
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-500" />
                  <span>CAMPFIRE BEATS: INACTIVE (TAP TO PLAY)</span>
                </>
              )}
            </button>

            {/* Quick Stats Panel */}
            <div className="hidden sm:flex items-center gap-3 bg-stone-900/60 px-3.5 py-2 rounded-xl border border-zinc-800 text-xs font-mono text-stone-300">
              <span className="text-stone-500">M-CAP:</span>
              <span className="text-solana-green font-bold">$100K SPEEDWAY</span>
            </div>

            <a
              href="https://drive.google.com/file/d/1eS0oSEPCBBXIXOwJQ07-60-7rghHhVrJ/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-stone-900 border border-emerald-900/60 text-solana-green transition-all hover:bg-emerald-950/40 hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5"
              id="header-white-paper-btn"
            >
              <Compass className="w-3.5 h-3.5" />
              White Paper
            </a>

            <a
              href="#swap"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-solana-green to-emerald-500 text-jungle-950 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-solana-green/20"
            >
              Buy $BUSHGUY
            </a>
          </div>

        </div>
      </header>

      {/* Hero Interactive Moment Sandbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main sandbox visual showcase: taking 7 columns on large screens */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-jungle-900/40 border border-emerald-900/30 rounded-3xl p-5 sm:p-6 lg:p-8 relative overflow-hidden backdrop-blur-md">
            
            {/* The canvas particle logic is embedded inside this frame */}
            <ParticleCanvas momentId={activeMomentId} />

            <div className="relative z-20">
              
              {/* Dynamic tag overlay based on theme */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2.5 rounded-xl bg-stone-900/90 border border-zinc-800 text-lg">
                    {activeMoment.emoji}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 block tracking-widest uppercase">ACTIVE OUTPOST SCENE</span>
                    <h3 className="text-lg font-display font-semibold text-white tracking-tight">{activeMoment.title}</h3>
                  </div>
                </div>

                <div className="px-3 py-1 bg-stone-900/90 rounded-full border border-stone-800 text-xs text-stone-400 font-mono">
                  Solana Verified Safe
                </div>
              </div>

              {/* Spectacular animated Frame around the illustration */}
              <div className="relative aspect-square w-full max-w-lg mx-auto my-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-stone-900 bg-black group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMomentId}
                    initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.04, rotate: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* Glowing highlight ring */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    
                    <img
                      src={activeMoment.image}
                      alt={activeMoment.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Fun badge on picture */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                      <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 p-2.5 rounded-lg max-w-[80%]">
                        <span className="text-[9px] font-mono text-solana-green uppercase tracking-widest block">Survival Achievement Unlocked</span>
                        <p className="text-white text-xs font-semibold">{activeMoment.achievement}</p>
                      </div>
                      <div className="bg-solana-green text-jungle-950 font-mono font-extrabold text-[10px] px-2.5 py-1 rounded-md">
                        MULTIPLIER STAGE
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Description Panel */}
              <div className="mt-4 bg-stone-950/70 p-4 rounded-xl border border-emerald-950">
                <p className="text-stone-300 text-sm leading-relaxed">{activeMoment.description}</p>
              </div>

            </div>

            {/* Micro Interaction moments tray selectors */}
            <div className="mt-6 relative z-20">
              <span className="text-[10px] font-mono text-stone-400 block mb-2 tracking-wider uppercase text-center sm:text-left">
                👈 CLICK/TAP TO TOGGLE BUSH GUY ANIMATION MODES 👉
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {BUSH_MOMENTS.map((moment) => (
                  <button
                    key={moment.id}
                    onClick={() => switchMoment(moment.id)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl transition-all border outline-none text-center ${
                      activeMomentId === moment.id
                        ? 'bg-gradient-to-b from-stone-900 to-black border-solana-green text-white scale-102 glow-green'
                        : 'bg-stone-900/40 border-stone-800/40 text-stone-400 hover:text-stone-200 hover:border-stone-700/60'
                    }`}
                  >
                    <span className="text-xl mb-1 filter drop-shadow animate-bounce" style={{ animationDuration: activeMomentId === moment.id ? '1s' : '4s' }}>
                      {moment.emoji}
                    </span>
                    <span className="text-[10px] font-semibold tracking-tight uppercase whitespace-nowrap block">
                      {moment.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right text box: main pitch, buy widget, take 5 columns */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* The main bio block */}
            <div className="bg-jungle-900/40 border border-emerald-950 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden flex-1 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solana-green/10 text-solana-green border border-solana-green/20 text-xs font-mono mb-4">
                  <Flame className="w-3.5 h-3.5 fill-solana-green" />
                  100% Locked Liquidity Burned
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-none">
                  MEET <span className="text-solana-green">BUSH GUY</span>, THE SOLANA LION.
                </h1>
                
                <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed">
                  Deep in the digital jungle, where other meme tokens rug, freeze, and bite, <strong>Bush Guy</strong> sits comfortably in his hammock, completely safe. 
                </p>
                <p className="mt-3 text-stone-300 text-xs sm:text-sm leading-relaxed">
                  No venture capital allocations. No insider developer wallets. Just an untamed wilderness force with 1 Billion tokens thrown straight to the wolves and locks melted permanently. Get yourself a bush hat, sit around our campfire, and let's ride.
                </p>

                {/* Specific active parameters based on dynamic selected theme */}
                <div className="mt-6 space-y-3.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-emerald-950 font-mono text-xs">
                    <span className="text-stone-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-solana-green" /> Active Mode Benefit:
                    </span>
                    <span className="text-white font-bold">{activeMoment.achievement}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-emerald-950 font-mono text-xs">
                    <span className="text-stone-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-solana-purple" /> Dynamic Live Metric:
                    </span>
                    <span className="text-solana-green font-bold">{activeMoment.funStat}</span>
                  </div>
                </div>

                <div className="mt-6 bg-emerald-950/40 border border-emerald-900/40 p-4 rounded-xl">
                  <h4 className="text-xs font-bold font-mono tracking-widest text-[#14F195] uppercase mb-2">🌿 Dynamic Sandbox Perks:</h4>
                  <ul className="text-xs text-stone-300 space-y-1.5 font-mono">
                    {activeMoment.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-solana-green">✔</span> <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Solana Contract Address block */}
              <div className="mt-6 pt-6 border-t border-emerald-950/80">
                <div className="flex items-center justify-between text-xs font-mono mb-2 text-stone-400">
                  <span>SOLANA CONTRACT ADDRESS:</span>
                  {copied ? (
                    <span className="text-solana-green text-[10px] font-bold">COPIED SUCCESSFULLY!</span>
                  ) : (
                    <span className="text-stone-500">TAP TOKEN TO COPY</span>
                  )}
                </div>
                
                <div 
                  onClick={copyContractToClipboard}
                  className="bg-stone-950/95 border border-stone-800 rounded-xl p-3 flex items-center justify-between gap-2 hover:border-solana-green/40 cursor-pointer transition-all active:scale-98 relative group"
                >
                  <span className="font-mono text-xs text-stone-300 overflow-hidden text-ellipsis whitespace-nowrap tracking-wide select-all">
                    {CONTRACT_ADDRESS}
                  </span>
                  <div className="p-1 px-2.5 rounded bg-zinc-900 text-[10px] text-solana-green font-mono border border-zinc-800 flex items-center gap-1 group-hover:bg-solana-green group-hover:text-jungle-950 transition-colors">
                    <Copy className="w-3 h-3" />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <a
                    href="https://solscan.io/token/BSMF8NPcATgRTSk2a2VNUmXsZ8LfzwdVA21jULfypump?page=2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-solana-green/85 hover:text-solana-green transition-colors font-mono hover:underline group/link"
                  >
                    <span>View on Solscan Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                  <span className="text-[10px] font-mono text-stone-500">Solscan Verified</span>
                </div>
              </div>

            </div>

            {/* CTA action shortcuts block */}
            <div id="swap" className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
              <h3 className="font-display font-bold text-lg text-white mb-1 tracking-tight">SOLANA CAMPFIRE INTEGRATOR</h3>
              <p className="text-xs text-stone-400 mb-4 font-mono">Simulate a seed-buy directly. Zero tax slippage required.</p>
              
              <div className="space-y-3">
                <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-3.5">
                  <div className="flex justify-between text-[11px] font-mono text-stone-500 mb-1.5">
                    <span>YOU DEPOSIT</span>
                    <span>BAL: 12.5 SOL</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-bold text-white">SOL</span>
                      <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-white font-mono">SOLANA</span>
                    </div>
                    <input
                      type="number"
                      step="1"
                      min="0.1"
                      className="bg-transparent border-none text-right font-mono font-bold text-lg text-white outline-none w-1/2 focus:ring-0"
                      value={solInvestment}
                      onChange={(e) => setSolInvestment(Math.max(0.1, Number(e.target.value)))}
                    />
                  </div>
                </div>

                <div className="h-2 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-solana-green text-xs font-mono font-bold select-none cursor-pointer hover:bg-solana-green hover:text-jungle-950 transition-colors">
                    ↓
                  </div>
                </div>

                <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-3.5">
                  <div className="flex justify-between text-[11px] font-mono text-stone-500 mb-1.5">
                    <span>YOU RECEIVE (ESTIMATE)</span>
                    <span>10M tokens per SOL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-solana-green">$BUSHGUY</span>
                    <span className="font-mono font-bold text-stone-200">
                      {calculatedTokens.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  showNotification(`🚀 Initializing Phantom Wallet swap link for ${solInvestment} SOL!`);
                }}
                className="w-full mt-4 py-3 bg-gradient-to-r from-solana-green via-[#122b13] to-solana-purple text-white font-bold rounded-2xl uppercase tracking-wider text-xs border border-solana-green/20 shadow-lg shadow-solana-green/5 hover:opacity-95 transition-all text-center animate-pulse"
              >
                SWAP SOL FOR $BUSHGUY
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Why get in early section */}
      <section className="bg-stone-950/60 border-y border-emerald-950/40 relative z-30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 bg-solana-green/10 text-solana-green border border-solana-green/20 rounded-full text-xs font-mono tracking-widest uppercase inline-block mb-3">
              THE GOLDEN ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              WHY GETTING IN EARLY ACTUALLY MATTERS 
            </h2>
            <p className="mt-3 text-stone-400 text-sm">
              In Solana DeFi history, the greatest growth multipliers belonged to the pioneers at the campfire before the world got noisy. Here's a raw mathematical projection.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive sliders & projections panel */}
            <div className="lg:col-span-5 bg-jungle-900/50 border border-emerald-900/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="font-display font-bold text-lg text-stone-100">CAMPFIRE PROFITS CALCULATOR</h3>
                
                {/* CoinGecko live price rate loader */}
                <button
                  onClick={() => fetchSolPrice(true)}
                  disabled={isPriceFetching}
                  className={`self-start sm:self-auto flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-950 border border-emerald-950/80 text-[10px] font-mono hover:border-solana-green/45 transition-all select-none ${
                    isPriceFetching ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                  }`}
                  title="Force recheck live Solana price from CoinGecko API"
                  id="coingecko-rate-sync"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${priceSource === 'coingecko' ? 'bg-solana-green animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-stone-300 font-semibold">SOL: ${solPrice.toFixed(2)}</span>
                  <span className={`text-[8px] text-stone-500 font-bold ${isPriceFetching ? 'animate-spin' : ''}`}>
                    {isPriceFetching ? '⌛' : '⟲'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-stone-400 mb-6 font-mono">Slide to pick your starting venture. See your early advantage multiply.</p>

              {/* Slider Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-400">YOUR DEPOSIT SEED:</span>
                  <span className="text-solana-green font-bold">{solInvestment} SOL (~${(solInvestment * solPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={solInvestment}
                  onChange={(e) => setSolInvestment(Number(e.target.value))}
                  className="w-full accent-solana h-2 bg-stone-900 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex justify-between text-[10px] font-mono text-stone-500">
                  <span>1 SOL</span>
                  <span>50 SOL</span>
                  <span>100 SOL</span>
                </div>
              </div>

              {/* Outputs display */}
              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block mb-1">Your Total Token Bag:</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-extrabold text-white">{calculatedTokens.toLocaleString()}</span>
                    <span className="font-mono text-xs text-solana-green">$BUSHGUY</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-teal-950/30 border border-emerald-800/20">
                  <span className="text-[10px] font-mono text-solana-green uppercase tracking-widest block mb-1">If $BUSHGUY hits WIF / BONK metrics ($1B Cap)</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-solana-green">
                      ${(calculatedTokens * 0.001).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="font-mono text-xs text-[#9945FF] font-bold">10,000x Multiplier!</span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 font-mono">
                    That is equivalent to buying physical real estate or driving your mud Ferrari off-road on premium fuel.
                  </p>
                </div>
              </div>

              {/* Survivor rank Badge */}
              <div className="mt-6 flex items-center gap-3 bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                <span className="text-2xl">
                  {solInvestment >= 80 ? '👑' : solInvestment >= 40 ? '🐆' : solInvestment >= 15 ? '🏎️' : '⛺'}
                </span>
                <div>
                  <span className="text-[10px] font-mono text-stone-500 block uppercase">PIONEER CAMP RANK</span>
                  <strong className="text-white text-xs font-semibold uppercase">
                    {solInvestment >= 80 
                      ? 'Wild Wilderness Emperor' 
                      : solInvestment >= 40 
                      ? 'Mud Ferrari Masterclass Owner' 
                      : solInvestment >= 15 
                      ? 'Camp-knife Money Slasher' 
                      : 'Humble Campfire Wood Collector'}
                  </strong>
                </div>
              </div>

            </div>

            {/* Matrix details Table taking 7 columns */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-emerald-950 text-xs font-mono text-stone-300">
                <span className="text-solana-green font-bold mr-1">💡 FACT:</span>
                Meme coins that grow organically starting at a humble $100K-tier have extreme ceiling potentials. Entering early means your margin of safety is unmatched.
              </div>

              <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-md">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0c1a0e] text-stone-300 uppercase text-[9px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-3.5 pl-4">STAGE OF GROWTH</th>
                      <th className="p-3.5">EST. M-CAP</th>
                      <th className="p-3.5">COIN VALUE</th>
                      <th className="p-3.5">EST. OUTCOME</th>
                      <th className="p-3.5 text-right pr-4">GROWTH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {EARLY_MATH_DATA.map((row, idx) => {
                      const computedSolOut = calculatedTokens * parseFloat(row.price.replace('$', ''));
                      return (
                        <tr 
                          key={idx} 
                          className={`hover:bg-[#122b13]/20 transition-colors ${
                            idx === 0 ? 'bg-solana-green/5 text-solana-green' : ''
                          }`}
                        >
                          <td className="p-3.5 pl-4 font-semibold text-stone-200">
                            {row.stage}
                          </td>
                          <td className="p-3.5 text-stone-300">{row.marketCap.split(' (')[0]}</td>
                          <td className="p-3.5 text-stone-400">{row.price}</td>
                          <td className="p-3.5 font-bold text-white">
                            ${computedSolOut.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                          <td className="p-3.5 text-right pr-4 text-solana-green font-bold">
                            {row.multiplier}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-2.5">
                <span className="text-[10px] font-mono text-[#9945FF] block tracking-wide uppercase">⚡ SURVIVAL GUIDE NOTES:</span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Most buyers purchase coins near peak hype when the market cap exceeds $200Million, yielding small upside caps. Buying $BUSHGUY early leverages maximal geometric growth metrics. 
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Standalone Campfire Code Animation Section */}
      <section id="campfire-cinematic-loop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-30">
        <div className="bg-[#0a0a0a] border border-orange-500/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-mono tracking-widest uppercase inline-block mb-3">
              🔥 LIVE DIGITAL HEARTH
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              BASK IN THE GLOW OF THE $BUSHGUY HEARTH
            </h2>
            <p className="mt-2 text-stone-400 text-sm">
              Take a breather from the wild chart fluctuations. Rest by our fully synchronized digital campfire rendered entirely in dynamic, real-time code.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.15)] bg-black" id="campfire-video-container">
            <CampfireCanvas />
            
            {/* Interactive fire crackle indicator in corner */}
            <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-amber-500/30 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-xs font-mono text-amber-500 z-20">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>LOOPS SEAMLESSLY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Tokenomics Segment with compass circle chart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-30">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 bg-[#9945FF]/10 text-solana-purple border border-solana-purple/20 rounded-full text-xs font-mono tracking-widest uppercase inline-block mb-3">
            IMMUTABLE STATS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            THE IMMUTABLE COMPASS TOKENOMICS
          </h2>
          <p className="mt-3 text-stone-400 text-sm">
            No math tricks. No locked marketing schemas that dev drops arbitrarily. 100% of supply goes straight to the wild open public.
          </p>
        </div>

        <div className="bg-jungle-900/40 border border-emerald-900/30 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* The Compass-Steering interactive SVG Chart */}
            <div className="flex flex-col items-center justify-center p-4 relative">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                
                {/* Underglow accent circles */}
                <div className="absolute inset-4 rounded-full bg-solana-green/5 blur-xl animate-pulse" />
                <div className="absolute inset-8 rounded-full bg-solana-purple/5 blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />

                {/* Outer spinning compass card compass marker */}
                <div className="absolute inset-0 rounded-full border border-dashed border-emerald-800/60 animate-spin-slow pointer-events-none" />

                {/* Main full-circle SVG Pie chart represent 100% Locked Liquidity */}
                <svg className="w-full h-full transform -rotate-90 select-none" viewBox="0 0 100 100">
                  {/* Backdrop Track track representing total empty circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#0a170a"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Solana Locked Burn segment (100%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#14F195"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-500 hover:stroke-[#9945FF]"
                    fill="transparent"
                  />
                  
                  {/* Compass cardinal lines */}
                  <line x1="50" y1="5" x2="50" y2="12" stroke="#061408" strokeWidth="1" />
                  <line x1="50" y1="88" x2="50" y2="95" stroke="#061408" strokeWidth="1" />
                  <line x1="5" y1="50" x2="12" y2="50" stroke="#061408" strokeWidth="1" />
                  <line x1="88" y1="50" x2="95" y2="50" stroke="#061408" strokeWidth="1" />
                </svg>

                {/* Inner Compass Glass Face floating elements */}
                <div className="absolute inset-16 rounded-full bg-stone-950/95 border-2 border-stone-800 flex flex-col items-center justify-center text-center shadow-2xl p-4 z-20">
                  <Compass className="w-7 h-7 text-solana-green mb-1 animate-spin-slow" />
                  <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest block text-stone-500">LIQUIDITY STATUS</span>
                  <span className="text-xl font-bold font-display text-white mt-1">100% LOCK</span>
                  <span className="text-[9px] font-mono text-solana-green tracking-tight font-extrabold uppercase mt-0.5">🔥 MELTED FOREVER</span>
                </div>

                {/* Compass Needle marker points indicating Solana LP block */}
                <div className="absolute w-2 h-26 bg-gradient-to-t from-transparent via-solana-purple to-solana-green rounded z-10 animate-spin" style={{ animationDuration: '6s' }} />

              </div>

              {/* Informative labels adjacent to gauge */}
              <div className="mt-6 text-center">
                <p className="text-sm text-stone-200 font-semibold flex items-center gap-1.5 justify-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-solana-green" /> 
                  1 Billion Supply (100% Liquidity Pool Deposit)
                </p>
                <p className="text-xs text-stone-400 mt-1.5 font-mono">
                  There is zero token allocation left outside, no marketing split.
                </p>
              </div>

            </div>

            {/* Structured details list right side adjacent to chart */}
            <div className="space-y-5">
              <h3 className="font-display font-extrabold text-2xl text-white">THE TOKENS BREAKDOWN</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Most coins allocate massive reserves for advisors or "future marketing projects", which invariably get liquidated onto retail purchasers. Under Bush Guy laws, the entire asset base (100%) resides within the Raydium liquidity map. 
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-550 block text-stone-550">TOTAL SUPPLY SUPPLY:</span>
                  <p className="text-lg font-bold text-white font-display mt-0.5">1,000,000,000 Token</p>
                  <p className="text-[10px] text-solana-green font-mono block mt-1">✓ Verified Solid Cap</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-550 block text-stone-550">CIRCULATING SUPPLY:</span>
                  <p className="text-lg font-bold text-white font-display mt-0.5">1,000,000,000 Token</p>
                  <p className="text-[10px] text-solana-green font-mono block mt-1">✓ 100% Circulating</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-550 block text-stone-550">TAX STRUCTURING FEE:</span>
                  <p className="text-lg font-bold text-white font-display mt-0.5">0% BUY / SELL TAX</p>
                  <p className="text-[10px] text-solana-green font-mono block mt-1">✓ No hidden drain rules</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                  <span className="text-[10px] font-mono text-stone-550 block text-stone-550">MINT AUTHORITY:</span>
                  <p className="text-lg font-bold text-white font-display mt-0.5">COMPLETELY REVOKED</p>
                  <p className="text-[10px] text-solana-green font-mono block mt-1">✓ Cannot create more coins</p>
                </div>

              </div>

              {/* Security highlights indicators row */}
              <div className="p-4 rounded-xl bg-[#0c1a0e] border border-solana-green/20 flex flex-col sm:flex-row items-center gap-3.5">
                <Shield className="w-8 h-8 text-solana-green shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">LOCKED & DEFUNCT SECURE COMPASS CONTRACT</h4>
                  <p className="text-stone-350 text-xs mt-0.5">
                    Solana explorer locks have been melted completely. Liquidity pool tokens are sent to Solana system black-hole wallet address. Zero chance of pull or team dumping!
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Campaign milestones (The Roadmap trail) */}
      <section className="bg-stone-950/40 border-y border-emerald-950/40 relative z-30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 bg-solana-green/10 text-solana-green border border-solana-green/20 rounded-full text-xs font-mono tracking-widest uppercase inline-block mb-3">
              THE EXPEDITION
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              BUSH GUY EXPEDITION MAP 
            </h2>
            <p className="mt-3 text-stone-300 text-sm">
              We started our campfire with dry grass, but we are hacking our path to the golden oasis. Follow each completed phase trail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP_DATA.map((milestone, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-2xl border transition-all relative ${
                  milestone.status === 'completed' 
                    ? 'bg-emerald-950/20 border-emerald-900/60' 
                    : milestone.status === 'active' 
                    ? 'bg-stone-900/40 border-solana-green glow-green'
                    : 'bg-stone-900/10 border-stone-800/40'
                }`}
              >
                {/* Visual Connector Line */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-solana-green block tracking-wide uppercase">
                    {milestone.phase}
                  </span>
                  
                  {milestone.status === 'completed' ? (
                    <span className="text-[10px] bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded text-solana-green font-mono uppercase">
                      Burned LP Done
                    </span>
                  ) : milestone.status === 'active' ? (
                    <span className="text-[10px] bg-solana-green/20 border border-solana-green px-2 py-0.5 rounded text-solana-green font-mono uppercase animate-pulse">
                      In Orbit
                    </span>
                  ) : (
                    <span className="text-[10px] bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-stone-500 font-mono uppercase">
                      Hacking Next
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-display font-bold text-white tracking-tight mb-4">
                  {milestone.title}
                </h3>

                <ul className="text-xs text-stone-400 space-y-2.5 font-mono">
                  {milestone.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-1.5">
                      <span className={milestone.status === 'completed' ? 'text-solana-green' : 'text-stone-600'}>└</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Corner watermarking step badge */}
                <span className="absolute bottom-4 right-4 text-3xl opacity-5 select-none pointer-events-none font-bold">
                  0{idx + 1}
                </span>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Wilderness Questions Accordion FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-30">
        
        <div className="text-center mb-12">
          <HelpCircle className="w-10 h-10 text-solana-green mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            CAMPFIRE ANSWERS & TALK
          </h2>
          <p className="mt-2 text-stone-400 text-sm font-mono">
            Everything you need to verify before loading your SOL wallet.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQ_DATA.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-stone-900/50 border border-stone-800 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 select-none outline-none focus:ring-0"
              >
                <span className="text-sm font-bold font-display text-stone-200 hover:text-white transition-colors">
                  {faq.question}
                </span>
                <span className="text-lg text-solana-green font-mono">
                  {activeFaq === idx ? '▲' : '▼'}
                </span>
              </button>

              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-5 pt-0 text-stone-400 text-xs sm:text-sm border-t border-stone-800/40 leading-relaxed font-mono select-text">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </section>

      {/* Premium White Paper CTA Section at the bottom of the page */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-30">
        <div className="bg-gradient-to-r from-emerald-950/40 via-stone-900/60 to-purple-950/40 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 text-center backdrop-blur-md glow-green relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,241,149,0.06)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="p-3 bg-solana-green/10 text-solana-green rounded-2xl border border-solana-green/20">
              <Compass className="w-8 h-8 text-solana-green animate-[spin_10s_linear_infinite]" />
            </div>
            
            <div>
              <span className="px-3 py-1 bg-solana-green/10 text-solana-green border border-solana-green/20 rounded-full text-[10px] font-mono tracking-widest uppercase inline-block mb-2">
                Survival Guide Book
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                READ THE OFFICIAL WHITE PAPER
              </h2>
              <p className="mt-2 text-stone-300 text-xs sm:text-sm font-mono max-w-xl mx-auto leading-relaxed">
                Unlock the deeper secrets of $BUSHGUY. Find out how our token supply mechanics, ecosystem initiatives, and wilderness-proven meme structures guarantee safe campfire relaxation.
              </p>
            </div>

            <a
              href="https://drive.google.com/file/d/1eS0oSEPCBBXIXOwJQ07-60-7rghHhVrJ/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-8 py-3.5 bg-gradient-to-r from-solana-green to-emerald-500 text-jungle-950 font-extrabold rounded-2xl uppercase tracking-wider text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-solana-green/20 flex items-center gap-2 group"
              id="bottom-whitepaper-btn"
            >
              <span>Get the Bush Blueprint (PDF)</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Safety Disclaimers segment (obligatory for finance display standard) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-30 opacity-70">
        <div className="bg-stone-900/30 border border-zinc-900 rounded-2xl p-6 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#fbbf24] mb-2.5">
            <AlertCircle className="w-4 h-4 fill-amber-950/40" />
            <span>NATURE ECO-SYSTEM MEME coin DISCLAIMER WARNING</span>
          </div>
          <p className="text-[10px] font-mono text-stone-500 leading-relaxed text-center">
            $BUSHGUY is a purely speculative decentralized meme coin intended for entertainment, community hiking, and visual cartoon amusement only. It has zero intrinsic utility, no corporate management team, and represents no financial yield guarantees. All tokens reside inside locked smart liquidity indexes and can shift scale dynamically. Do not deposit capital you cannot afford to throw directly into campfires!
          </p>
        </div>
      </section>

      {/* Footer section matching bento themes */}
      <footer className="bg-[#040c05] border-t border-emerald-950/50 py-10 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <img
              src={BUSH_GUY_IMAGES.logo}
              alt="Bush Guy Logo"
              className="w-10 h-10 rounded-full border border-solana-green object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <strong className="text-white text-sm font-display tracking-wide uppercase">BUSH GUY COIN</strong>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">© 2026 BushGuy. All Campfire Keys Melted.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400">
            <a 
              href="https://drive.google.com/file/d/1eS0oSEPCBBXIXOwJQ07-60-7rghHhVrJ/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-solana-green transition-colors flex items-center gap-1.5 font-bold text-solana-green"
              id="footer-whitepaper-btn"
            >
              📖 White Paper
            </a>
            <span className="text-stone-700">|</span>
            <a 
              href="https://github.com/Bushguymeme"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-solana-green transition-colors flex items-center gap-1 font-bold text-stone-300"
              id="footer-github-btn"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <span className="text-stone-700">|</span>
            <a 
              href="#swap" 
              className="hover:text-solana-green transition-colors"
              onClick={() => showNotification("⛺ Welcome to our Raydium Pool camp!")}
            >
              Raydium Pool
            </a>
            <span className="text-stone-700">|</span>
            <a 
              href="#swap" 
              className="hover:text-solana-green transition-colors"
              onClick={() => showNotification("🐦 Join our Twitter/X jungle network!")}
            >
              Twitter/X
            </a>
            <span className="text-stone-700">|</span>
            <a 
              href="#swap" 
              className="hover:text-solana-green transition-colors"
              onClick={() => showNotification("💬 Enter the Telegram Basecamp Chat!")}
            >
              Telegram Chat
            </a>
            <span className="text-stone-700">|</span>
            <a 
              href="https://solscan.io/token/BSMF8NPcATgRTSk2a2VNUmXsZ8LfzwdVA21jULfypump?page=2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-solana-green transition-colors flex items-center gap-0.5"
            >
              <span>Solscan</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-solana-green text-solana-green" />
            <span>for Solana Climbers</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

