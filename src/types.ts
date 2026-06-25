/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BushMomentId = 'chilling' | 'slashing' | 'ferrari' | 'swimming' | 'flexing';

export interface BushMoment {
  id: BushMomentId;
  title: string;
  emoji: string;
  image: string;
  description: string;
  bgColor: string;
  primaryColor: string;
  accentColor: string;
  achievement: string;
  funStat: string;
  perks: string[];
}

export interface EarlyMathComparison {
  stage: string;
  price: string;
  marketCap: string;
  multiplier: string;
  outcome: string;
  description: string;
}

export interface Milestone {
  phase: string;
  title: string;
  status: 'completed' | 'active' | 'upcoming';
  items: string[];
}
