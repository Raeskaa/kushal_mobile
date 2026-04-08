import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─── Constants ──────────────────────────────────────────────────
export const CREDITS_PER_USD = 60; // $1 = 60 credits, so $2 = 120 credits

export function usdToCredits(usd: number): number {
  return Math.round(usd * CREDITS_PER_USD);
}

export function creditsToUsd(credits: number): number {
  return credits / CREDITS_PER_USD;
}

export function formatCredits(credits: number): string {
  if (credits >= 1000) return `${(credits / 1000).toFixed(1)}k`;
  return credits.toLocaleString();
}

// ─── Credit Packs (for learners to buy) ─────────────────────────
export interface CreditPack {
  id: string;
  credits: number;
  price: number; // USD
  bonus: number; // extra credits
  label: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'starter', credits: 300, price: 5, bonus: 0, label: 'Starter' },
  { id: 'standard', credits: 600, price: 10, bonus: 60, label: 'Standard', popular: true },
  { id: 'pro', credits: 1500, price: 25, bonus: 300, label: 'Pro' },
  { id: 'enterprise', credits: 3600, price: 50, bonus: 900, label: 'Enterprise' },
];

// ─── Transaction Log ────────────────────────────────────────────
export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'spend' | 'refund' | 'bonus';
  amount: number; // positive for add, negative for spend
  description: string;
  timestamp: string;
  eventName?: string;
}

// ─── Context ────────────────────────────────────────────────────
interface CreditStore {
  // LeapSpace-wide (admin view)
  leapspaceBalance: number;
  leapspaceTotalCredits: number;
  // Individual user (learner view)
  userBalance: number;
  userTotalPurchased: number;
  // Transactions
  transactions: CreditTransaction[];
  // Actions
  spendCredits: (amount: number, description: string, eventName?: string) => boolean;
  addCredits: (amount: number, description: string) => void;
  purchasePack: (packId: string) => boolean;
  // Helpers
  canAfford: (credits: number) => boolean;
}

const CreditContext = createContext<CreditStore | null>(null);

const INITIAL_TRANSACTIONS: CreditTransaction[] = [
  { id: 'tx-1', type: 'purchase', amount: 600, description: 'Standard Pack purchased', timestamp: '2026-03-10T14:00:00' },
  { id: 'tx-2', type: 'spend', amount: -120, description: 'Ticket: AI Workshop Masterclass', timestamp: '2026-03-10T15:30:00', eventName: 'AI Workshop Masterclass' },
  { id: 'tx-3', type: 'bonus', amount: 60, description: 'Welcome bonus credits', timestamp: '2026-03-08T09:00:00' },
  { id: 'tx-4', type: 'spend', amount: -180, description: 'Ticket: Design Systems Summit', timestamp: '2026-03-07T11:00:00', eventName: 'Design Systems Summit' },
  { id: 'tx-5', type: 'purchase', amount: 1500, description: 'Pro Pack purchased', timestamp: '2026-03-05T10:00:00' },
  { id: 'tx-6', type: 'spend', amount: -300, description: 'Ticket: Product Leadership Bootcamp', timestamp: '2026-03-04T16:00:00', eventName: 'Product Leadership Bootcamp' },
  { id: 'tx-7', type: 'refund', amount: 120, description: 'Refund: Cancelled event', timestamp: '2026-03-03T14:00:00', eventName: 'Tech Talk #12' },
];

export function CreditProvider({ children }: { children: ReactNode }) {
  const [userBalance, setUserBalance] = useState(1680); // learner's current balance
  const [userTotalPurchased, setUserTotalPurchased] = useState(2100);
  const [transactions, setTransactions] = useState<CreditTransaction[]>(INITIAL_TRANSACTIONS);

  // LeapSpace-wide stats (admin view — aggregated across all users)
  const leapspaceBalance = 47_250;
  const leapspaceTotalCredits = 125_000;

  const canAfford = useCallback((credits: number) => userBalance >= credits, [userBalance]);

  const spendCredits = useCallback((amount: number, description: string, eventName?: string) => {
    if (userBalance < amount) return false;
    setUserBalance(prev => prev - amount);
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      type: 'spend',
      amount: -amount,
      description,
      timestamp: new Date().toISOString(),
      eventName,
    }, ...prev]);
    return true;
  }, [userBalance]);

  const addCredits = useCallback((amount: number, description: string) => {
    setUserBalance(prev => prev + amount);
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      type: 'purchase',
      amount,
      description,
      timestamp: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const purchasePack = useCallback((packId: string) => {
    const pack = CREDIT_PACKS.find(p => p.id === packId);
    if (!pack) return false;
    const total = pack.credits + pack.bonus;
    setUserBalance(prev => prev + total);
    setUserTotalPurchased(prev => prev + total);
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      type: 'purchase',
      amount: total,
      description: `${pack.label} Pack purchased (+${pack.bonus > 0 ? `${pack.bonus} bonus` : 'no bonus'})`,
      timestamp: new Date().toISOString(),
    }, ...prev]);
    return true;
  }, []);

  return (
    <CreditContext.Provider value={{
      leapspaceBalance,
      leapspaceTotalCredits,
      userBalance,
      userTotalPurchased,
      transactions,
      spendCredits,
      addCredits,
      purchasePack,
      canAfford,
    }}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditContext);
  return ctx;
}