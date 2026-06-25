/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BushMoment, EarlyMathComparison, Milestone } from './types.ts';

export const BUSH_GUY_IMAGES = {
  logo: '/src/assets/images/bush_guy_logo_1782172312510.jpg',
  chilling: '/src/assets/images/bush_guy_chilling_1782172327636.jpg',
  slashing: '/src/assets/images/bush_guy_slashing_1782172339985.jpg',
  ferrari: '/src/assets/images/bush_guy_ferrari_1782172353753.jpg',
  swimming: '/src/assets/images/bush_guy_swimming_1782172366248.jpg',
  flexing: '/src/assets/images/bush_guy_flexing_1782172379501.jpg',
};

export const CONTRACT_ADDRESS = 'BushGuy11111111111111111111111111111BScN';

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
    price: '$0.00000010',
    marketCap: '$100,000 (Tiny Microcap)',
    multiplier: '1x',
    outcome: '$100 Investment',
    description: 'You purchase early. Only a few wilderness pioneers know about the Bush Guy campfire.'
  },
  {
    stage: 'Viral Organic Shilling',
    price: '$0.00000100',
    marketCap: '$1,000,000 (1M Cap)',
    multiplier: '10x',
    outcome: '$1,000 (Free camping gear!)',
    description: 'The green money-slashing memes hit TikTok and Twitter/X. Communities rally.'
  },
  {
    stage: 'Solana Ecosystem Spotlight',
    price: '$0.00001000',
    marketCap: '$10,000,000 (10M Cap)',
    multiplier: '100x',
    outcome: '$10,000 (Real bush jacuzzi!)',
    description: 'Major influencers start sporting brown explorer hats. Dexscreener trending is locked.'
  },
  {
    stage: 'Tier 1 Central Exchange Listing',
    price: '$0.00010000',
    marketCap: '$100,000,000 (100M Cap)',
    multiplier: '1,000x',
    outcome: '$100,000 (Buy a nice Jeep!)',
    description: 'Ferrari moment becomes reality. Trading is automated across worldwide exchanges.'
  },
  {
    stage: 'Global Culture Icon ($WIF / $BONK tier)',
    price: '$0.00100000',
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
      'Deploy $BUSHGUY on Solana Blockchain (1 Billion Supply)',
      '100% of supply deposited to Raydium LP',
      'Contract keys burned in campfire (Zero Mint/Freeze authority)',
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
    answer: 'The official contract on Solana is pending final pool launch, during the presale/stealth phase we use our emblem contract: ' + CONTRACT_ADDRESS + '. Always check official channels!'
  },
  {
    question: 'Is the liquidity and supply really 100% burned?',
    answer: 'Absolutely. Every single coin (1 Billion total) was thrown directly into the liquidity pool and the LP tokens have been permanently burned. There is zero team allocation, zero tax, and zero developer reserve. A pure, untamed, democratic wilderness play!'
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
