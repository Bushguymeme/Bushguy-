/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BushMoment, EarlyMathComparison, Milestone, StrategicPartner, FutureListing } from './types.ts';

export const BUSH_GUY_IMAGES = {
  logo: '/images/bush_guy_logo_1782172312510.jpg',
  chilling: '/images/bush_guy_chilling_1782172327636.jpg',
  slashing: '/images/bush_guy_slashing_1782172339985.jpg',
  ferrari: '/images/bush_guy_ferrari_1782172353753.jpg',
  swimming: '/images/bush_guy_swimming_1782172366248.jpg',
  flexing: '/images/bush_guy_flexing_1782172379501.jpg',
};

export const BUSH_MOMENTS: BushMoment[] = [
  {
    id: 'chilling',
    title: 'The Chill Wilderness Camp',
    emoji: '🏕️',
    image: BUSH_GUY_IMAGES.chilling,
    description: 'BUSH GUY sips slow-brewed billy tea by the crackling woodfire under the starry sky. Peace, tranquility, and zero red-market stress.',
    bgColor: 'from-emerald-950 via-slate-950 to-emerald-950',
    primaryColor: '#10b981', // emerald-500
    accentColor: '#14F195', // solana neon green
    achievement: 'Ultimate Diamond Hand Vibe',
    funStat: '1,500 Crickets Chirped Syncopatedly',
    perks: ['Relaxed compound interest mindset', 'Immunized against FUD (Fear, Uncertainty, Doubt)', 'Zero leverage, 100% inner peace']
  },
  {
    id: 'slashing',
    title: 'Bush-Knife Money Slash',
    emoji: '⚔️',
    image: BUSH_GUY_IMAGES.slashing,
    description: 'Whacking through weeds? No, BUSH GUY is swinging his carbon-steel machete to slice through green mountains of paper money and Solana coins!',
    bgColor: 'from-green-950 via-neutral-950 to-emerald-950',
    primaryColor: '#22c55e', // green-500
    accentColor: '#14F195',
    achievement: 'Machete Money Multiplier',
    funStat: '$1B Transformed into Splintered Off-Cuts',
    perks: ['Clears path for massive green candles', 'Saws trading fees to absolute zero', 'Active muscle training for holding bags']
  },
  {
    id: 'ferrari',
    title: 'Jungle Mud Ferrari Drifting',
    emoji: '🏎️',
    image: BUSH_GUY_IMAGES.ferrari,
    description: 'Who says sports cars need asphalt? BUSH GUY drifts a roaring red stallion through a primeval swamp, splattering gold mud and howling at chimpanzees.',
    bgColor: 'from-red-950 via-stone-950 to-neutral-950',
    primaryColor: '#ef4444', // red-500
    accentColor: '#f59e0b', // gold-500
    achievement: 'Wild Off-Road Lambo Alternative',
    funStat: '0-100 km/h in 2.3 seconds on banana leaves',
    perks: ['Supercharged speed run past traditional finance', 'Equipped with bespoke mud terrain racing tires', 'Loud exhaust mimics survival horn']
  },
  {
    id: 'swimming',
    title: 'Wild Jungle Pool Float',
    emoji: '🏝️',
    image: BUSH_GUY_IMAGES.swimming,
    description: 'Floating on a pink unicorn tube in a tropical deep-forest lagoon, complete with sunglasses, a fresh coconut, and a gold straw. Pure luxury in the wild landscape.',
    bgColor: 'from-cyan-950 via-indigo-950 to-zinc-950',
    primaryColor: '#06b6d4', // cyan-500
    accentColor: '#14F195',
    achievement: 'High-Liquidity Pool Sovereignty',
    funStat: '100% Eco-Friendly Coconut Cocktail Refills',
    perks: ['Immersive liquid asset floating', 'Complete shielding against sun exposure & inflation', 'Ambient moisture protects dry hands']
  },
  {
    id: 'flexing',
    title: 'Chunky Gold Wilderness Flex',
    emoji: '💪',
    image: BUSH_GUY_IMAGES.flexing,
    description: 'Bedizened with literal kilograms of pure golden necklaces, sparkly diamond grills, and solid bullion bars stacked high next to dried beef jerky storage.',
    bgColor: 'from-yellow-950 via-zinc-950 to-amber-950',
    primaryColor: '#fbbf24', // yellow-400
    accentColor: '#f59e0b', // amber-500
    achievement: 'Giga-Chad Explorer Level 99',
    funStat: '150kg of Gold Chain-Lifting Dumbbell Exercises',
    perks: ['Absolute visual dominance on Solana', 'Instant reputation upgrades at local trading posts', 'Shining gold bars double as mirrors']
  }
];

export const EARLY_MATH_DATA: EarlyMathComparison[] = [
  {
    stage: 'Now (Ground Floor)',
    price: '$0.0000001449',
    marketCap: '$100,000 (Tiny Microcap)',
    multiplier: '1x',
    outcome: '$100 Investment',
    description: 'You purchase early. Only a few wilderness pioneers know about the Bush Guy campfire.'
  },
  {
    stage: 'Viral Organic Shilling',
    price: '$0.0000014493',
    marketCap: '$1,000,000 (1M Cap)',
    multiplier: '10x',
    outcome: '$1,000 (Free camping gear!)',
    description: 'The green money-slashing memes hit TikTok and Twitter/X. Communities rally.'
  },
  {
    stage: 'Solana Ecosystem Spotlight',
    price: '$0.0000144928',
    marketCap: '$10,000,000 (10M Cap)',
    multiplier: '100x',
    outcome: '$10,000 (Real bush jacuzzi!)',
    description: 'Major influencers start sporting brown explorer hats. Dexscreener trending is locked.'
  },
  {
    stage: 'Tier 1 Central Exchange Listing',
    price: '$0.0001449275',
    marketCap: '$100,000,000 (100M Cap)',
    multiplier: '1,000x',
    outcome: '$100,000 (Buy a nice Jeep!)',
    description: 'Ferrari moment becomes reality. Trading is automated across worldwide exchanges.'
  },
  {
    stage: 'Global Culture Icon ($WIF / $BONK tier)',
    price: '$0.0014492753',
    marketCap: '$1,000,000,000 (1 Billion)',
    multiplier: '10,000x',
    outcome: '$1,000,000 (GENUINE RETIREMENT!)',
    description: 'Pool floating on pink unicorns is now your entire lifestyle. You are financial royalty.'
  }
];

export const ROADMAP_DATA: Milestone[] = [
  {
    phase: 'Phase 1: Forest Conception',
    title: 'The Great Igniting',
    status: 'completed',
    items: [
      'Concept birth & drawing Bush Guy in his forest camp',
      'Deploy $BUSHGUY on Solana Blockchain (690 Billion Supply)',
      '55% allocated to Presale & 35% to Liquidity Pool',
      '10% reserved for DEX listings, Development, Marketing & Partnerships',
      'Liquidity pool LP burned forever'
    ]
  },
  {
    phase: 'Phase 2: Wilderness Gathering',
    title: 'Smells Like Shilling',
    status: 'active',
    items: [
      'Meme creation across Socials: Tiktok, X, Youtube Shorts',
      'Community Launch with 5,000+ rugged pioneers',
      'Secure CoinGecko and CoinMarketCap rapid track indexes',
      'Community voting on next Bush Guy animation moment'
    ]
  },
  {
    phase: 'Phase 3: Jeep Outfitting',
    title: 'Expanding The Trail',
    status: 'upcoming',
    items: [
      'Strategic collaborations with top Solana meme projects',
      'Limited-edition Bush Guy survival merch (Hats, Knives, Flasks)',
      'First Tier-2 Exchange Listings (Mexc, Gate, Lbank)',
      'Real-world charity campaign to plant trees and save wildlife habitats'
    ]
  },
  {
    phase: 'Phase 4: Golden Oasis',
    title: 'The Infinite Flex',
    status: 'upcoming',
    items: [
      'Billboard takeover in key financial cities (and jungle centers!)',
      'Unveiling real Bush Guy customized driving Ferrari',
      'Integration with Solana Telegram mini-apps and adventure tap-to-earn games',
      'Becoming the undisputed global king of wilderness meme-culture'
    ]
  }
];

export const FAQ_DATA = [
  {
    question: 'What is the contract address?',
    answer: 'The official contract on Solana is pending final pool launch on Pinksale. It will be officially deployed and announced across our official community channels (Telegram/Twitter/X) prior to the fair launch event. Always verify using pinned messages!'
  },
  {
    question: 'What is the token distribution and supply?',
    answer: 'The total supply of $BUSHGUY is 690,000,000,000 (690 Billion). The distribution is carefully designed for sustainable growth: 55% for the Presale, 35% for the Liquidity Pool (with LP tokens burned permanently), and 10% reserved for DEX listing, development, marketing, and strategic partnerships.'
  },
  {
    question: 'How do I buy $BUSHGUY?',
    answer: 'Install a Solana-compatible wallet like Phantom, Solflare, or Backpack. Deposit SOL into your wallet. Head over to Raydium or Jupiter DEX, copy our contract address, and swap your SOL for $BUSHGUY. Make sure to keep some SOL for gas fees (though Solana fees are practically zero!)'
  },
  {
    question: 'Why is getting in early so valuable?',
    answer: 'Meme coins thrive on momentum. Buying at a $100K market cap versus a $100M market cap is a 1,000x difference in growth potential. By the time it hits major exchanges, early builders are already cruising in Ferraris, while latecomers are buying their exits!'
  }
];

export const STRATEGIC_PARTNERS: StrategicPartner[] = [
  {
    name: 'Pinksale',
    domain: 'pinksale.finance',
    url: 'https://www.pinksale.finance',
    logo: 'https://logo.clearbit.com/pinksale.finance',
    description: 'The ultimate launchpad for decentralized assets, hosting our fair launch presale event with premium contract auditing and liquidity lock validation.'
  },
  {
    name: 'Dexview',
    domain: 'dexview.com',
    url: 'https://www.dexview.com',
    logo: 'https://logo.clearbit.com/dexview.com',
    description: 'Advanced real-time charts, decentralized trade routing, and algorithmic telemetry tracking for $BUSHGUY on the Solana blockchain.'
  }
];

export const FUTURE_LISTINGS: FutureListing[] = [
  { name: 'Binance', domain: 'binance.com', logo: 'https://logo.clearbit.com/binance.com' },
  { name: 'Bybit', domain: 'bybit.com', logo: 'https://logo.clearbit.com/bybit.com' },
  { name: 'OKX', domain: 'okx.com', logo: 'https://logo.clearbit.com/okx.com' },
  { name: 'Bitget', domain: 'bitget.com', logo: 'https://logo.clearbit.com/bitget.com' },
  { name: 'KuCoin', domain: 'kucoin.com', logo: 'https://logo.clearbit.com/kucoin.com' },
  { name: 'Gate.io', domain: 'gate.io', logo: 'https://logo.clearbit.com/gate.io' },
  { name: 'MEXC', domain: 'mexc.com', logo: 'https://logo.clearbit.com/mexc.com' },
  { name: 'HTX', domain: 'htx.com', logo: 'https://logo.clearbit.com/htx.com' },
  { name: 'BitMart', domain: 'bitmart.com', logo: 'https://logo.clearbit.com/bitmart.com' },
  { name: 'CoinEx', domain: 'coinex.com', logo: 'https://logo.clearbit.com/coinex.com' },
  { name: 'LBank', domain: 'lbank.com', logo: 'https://logo.clearbit.com/lbank.com' },
  { name: 'XT.com', domain: 'xt.com', logo: 'https://logo.clearbit.com/xt.com' },
  { name: 'BingX', domain: 'bingx.com', logo: 'https://logo.clearbit.com/bingx.com' }
];

