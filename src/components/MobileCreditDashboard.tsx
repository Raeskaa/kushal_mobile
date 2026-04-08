import { useState } from 'react';
import {
  Coins, TrendingUp, TrendingDown, ShoppingCart, X,
  ArrowUpRight, ArrowDownLeft, Gift, RotateCcw, Plus,
  ChevronRight, BarChart3, Wallet
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useCredits, CREDIT_PACKS, formatCredits, type CreditTransaction } from '../data/CreditContext';
import { toast } from "sonner@2.0.3";

interface MobileCreditDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const TX_ICONS: Record<CreditTransaction['type'], { icon: React.ElementType; color: string; bg: string }> = {
  purchase: { icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
  spend: { icon: ArrowDownLeft, color: 'text-destructive', bg: 'bg-destructive/5' },
  refund: { icon: RotateCcw, color: 'text-primary', bg: 'bg-primary/5' },
  bonus: { icon: Gift, color: 'text-amber-600', bg: 'bg-amber-50' },
};

export function MobileCreditDashboard({ isOpen, onClose }: MobileCreditDashboardProps) {
  const credits = useCredits();
  const [activeTab, setActiveTab] = useState<'overview' | 'buy' | 'history'>('overview');

  if (!isOpen || !credits) return null;

  const usagePercent = credits.leapspaceTotalCredits > 0
    ? ((credits.leapspaceTotalCredits - credits.leapspaceBalance) / credits.leapspaceTotalCredits) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="mt-auto relative bg-card rounded-t-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-amber-50 rounded-full flex items-center justify-center">
              <Coins className="size-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-[16px] text-card-foreground">Credits</h2>
              <p className="text-[12px] text-muted-foreground">Your LeapSpace balance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pb-3 flex gap-1 flex-shrink-0">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'buy' as const, label: 'Buy Credits' },
            { id: 'history' as const, label: 'History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-[12px] transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Personal Balance */}
              <Card className="p-4 gap-3 bg-amber-50/50 border-amber-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-amber-700 uppercase tracking-wider">Your Balance</p>
                    <p className="text-[28px] text-amber-900 tabular-nums">{credits.userBalance.toLocaleString()}</p>
                    <p className="text-[12px] text-amber-600">credits available</p>
                  </div>
                  <div className="size-14 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Wallet className="size-7 text-amber-500" />
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab('buy')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Plus className="size-4" /> Buy More Credits
                </Button>
              </Card>

              {/* LeapSpace Pool (admin-visible) */}
              <Card className="p-4 gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-primary" />
                  <h3 className="text-[13px] text-card-foreground">LeapSpace Credit Pool</h3>
                  <Badge variant="outline" className="text-[9px]">Admin</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-[18px] text-card-foreground tabular-nums">{formatCredits(credits.leapspaceBalance)}</p>
                    <p className="text-[10px] text-muted-foreground">Available</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-[18px] text-card-foreground tabular-nums">{formatCredits(credits.leapspaceTotalCredits)}</p>
                    <p className="text-[10px] text-muted-foreground">Total Allocated</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Usage</span>
                    <span>{Math.round(usagePercent)}% used</span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {formatCredits(credits.leapspaceTotalCredits - credits.leapspaceBalance)} credits consumed across all members
                </p>
              </Card>

              {/* Quick Stats */}
              <Card className="p-4 gap-2">
                <h3 className="text-[13px] text-card-foreground">Your Stats</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-[16px] text-card-foreground tabular-nums">{credits.userTotalPurchased.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Total Bought</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] text-card-foreground tabular-nums">
                      {Math.abs(credits.transactions.filter(t => t.type === 'spend').reduce((s, t) => s + t.amount, 0)).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] text-card-foreground tabular-nums">
                      {credits.transactions.filter(t => t.type === 'spend').length}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Tickets</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'buy' && (
            <div className="space-y-3">
              <p className="text-[12px] text-muted-foreground">
                Select a credit pack. Credits never expire.
              </p>

              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => {
                    credits.purchasePack(pack.id);
                    toast.success(`${pack.label} Pack purchased! +${(pack.credits + pack.bonus).toLocaleString()} credits`);
                    setActiveTab('overview');
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    pack.popular ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] text-card-foreground">{pack.label}</p>
                        {pack.popular && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Popular</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Coins className="size-3.5 text-amber-500" />
                        <span className="text-[13px] text-amber-700">{pack.credits.toLocaleString()} credits</span>
                        {pack.bonus > 0 && (
                          <span className="text-[11px] text-green-600 bg-green-50 px-1 py-0.5 rounded">+{pack.bonus} bonus</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] text-card-foreground">${pack.price}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {((pack.credits + pack.bonus) / pack.price).toFixed(0)} cr/$
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              <div className="bg-muted rounded-lg p-3 flex items-start gap-2 mt-2">
                <Coins className="size-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground">
                  Bigger packs include bonus credits. Credits can be used for any event tickets across LeapSpace.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {credits.transactions.length > 0 ? (
                credits.transactions.map((tx) => {
                  const style = TX_ICONS[tx.type];
                  const Icon = style.icon;
                  const time = new Date(tx.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  });

                  return (
                    <div key={tx.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                      <div className={`size-9 rounded-lg flex items-center justify-center ${style.bg}`}>
                        <Icon className={`size-4 ${style.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-card-foreground truncate">{tx.description}</p>
                        <p className="text-[10px] text-muted-foreground">{time}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-[14px] tabular-nums ${tx.amount >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                          {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">credits</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Coins className="size-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-[13px] text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}