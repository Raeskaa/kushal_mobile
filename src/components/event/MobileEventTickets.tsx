import { useState } from 'react';
import { type MockEvent } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  Plus, DollarSign, Clock, Tag, Ticket, Sparkles, Pencil, Trash2,
  TrendingUp, Copy, BarChart3, Coins
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { useEventStore } from '../../data/EventStoreContext';
import { useCredits, usdToCredits, formatCredits, CREDITS_PER_USD } from '../../data/CreditContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { copyToClipboard } from '../../utils/copyToClipboard';

interface MobileEventTicketsProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function MobileEventTickets({ event, onOpenLeapy }: MobileEventTicketsProps) {
  const { removeTicket, removeDiscountCode } = useEventStore();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const creditStore = useCredits();

  const leapy = (type: string, extra?: Record<string, any>) =>
    onOpenLeapy?.({ type, entityId: event.id, entityData: event, extra } as LeapyContext);

  const tickets = event.tickets || [];
  const discountCodes = event.discountCodes || [];

  // Revenue calculations
  const totalSold = tickets.reduce((sum, t) => sum + (t.quantity - t.remaining), 0);
  const totalRevenue = tickets.reduce((sum, t) => sum + (t.quantity - t.remaining) * t.price, 0);
  const totalCapacity = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const simpleRevenue = event.isPaid && tickets.length === 0 ? event.attendeeCount * (event.price || 0) : 0;

  return (
    <div className="p-4 space-y-4">
      {/* Revenue Summary */}
      {event.isPaid && (
        <Card className="p-4 gap-3">
          <h3 className="text-sm text-card-foreground">Revenue</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Total Revenue</p>
              <p className="text-lg text-card-foreground">
                ${(totalRevenue || simpleRevenue).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Tickets Sold</p>
              <p className="text-lg text-card-foreground">{totalSold || event.attendeeCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Avg Price</p>
              <p className="text-lg text-card-foreground">
                ${totalSold > 0 ? Math.round(totalRevenue / totalSold) : event.price}
              </p>
            </div>
          </div>

          {/* Per-tier revenue breakdown (if multi-tier) */}
          {tickets.length > 1 && (
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-[10px] text-muted-foreground">Revenue by Tier</p>
              {tickets.map(ticket => {
                const sold = ticket.quantity - ticket.remaining;
                const tierRevenue = sold * ticket.price;
                const percent = totalRevenue > 0 ? (tierRevenue / totalRevenue) * 100 : 0;
                return (
                  <div key={ticket.id} className="flex items-center gap-2">
                    <span className="text-xs text-foreground w-20 truncate">{ticket.name}</span>
                    <Progress value={percent} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-16 text-right">${tierRevenue.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Ticket Tiers Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base text-card-foreground">Ticket Tiers</h2>
        <Button variant="secondary" size="sm" onClick={() => leapy('set_tickets')} className="bg-primary/10 text-primary hover:bg-primary/15">
          <Sparkles className="size-3.5" />
          Add Tier
        </Button>
      </div>

      {/* Ticket Tiers List */}
      {tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const soldPercent = ((ticket.quantity - ticket.remaining) / ticket.quantity) * 100;
            const isSoldOut = ticket.remaining === 0;
            const isExpanded = expandedTicket === ticket.id;

            return (
              <Card key={ticket.id} className="overflow-hidden gap-0">
                <button
                  onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                  className="w-full p-4 text-left active:bg-muted transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm text-card-foreground">{ticket.name}</h3>
                        {isSoldOut && (
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive text-[10px]">
                            Sold Out
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{ticket.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base text-card-foreground">${ticket.price}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Coins className="size-3 text-amber-500" />
                        <p className="text-[10px] text-amber-600">{usdToCredits(ticket.price).toLocaleString()} credits</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>{ticket.quantity - ticket.remaining} sold</span>
                    <span>{ticket.remaining} remaining</span>
                  </div>
                  <Progress value={soldPercent} className={`h-1.5 mt-1 ${isSoldOut ? '[&>[data-slot=progress-indicator]]:bg-destructive' : ''}`} />
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-3 space-y-3">
                    {ticket.perks && ticket.perks.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1.5">Includes:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ticket.perks.map((perk, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px]">
                              {perk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => leapy('set_tickets', { ticketId: ticket.id })} className="flex-1 h-7 text-xs">
                        <Pencil className="size-3" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeTicket(event.id, ticket.id);
                          toast.success(`${ticket.name} tier removed`);
                          setExpandedTicket(null);
                        }}
                        className="h-7 text-xs border-destructive/30 text-destructive"
                      >
                        <Trash2 className="size-3" /> Remove
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-4 flex-row items-center gap-3">
          <div className="size-10 bg-muted rounded-lg flex items-center justify-center">
            <DollarSign className="size-5 text-muted-foreground/40" />
          </div>
          <div>
            <p className="text-sm text-card-foreground">{event.isPaid ? `$${event.price}` : 'Free'}</p>
            <p className="text-xs text-muted-foreground">{event.isPaid ? 'Single tier' : 'No ticket required'}</p>
            {event.isPaid && event.price && (
              <div className="flex items-center gap-1 mt-0.5">
                <Coins className="size-3 text-amber-500" />
                <span className="text-[10px] text-amber-600">{usdToCredits(event.price).toLocaleString()} credits</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Early Bird */}
      {event.earlyBird && (
        <Card className="p-4 gap-2">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-secondary-foreground" />
            <h3 className="text-sm text-card-foreground">Early Bird Discount</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Discount</p>
              <p className="text-sm text-card-foreground">{event.earlyBird.discountPercent}%</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Deadline</p>
              <p className="text-sm text-card-foreground">{event.earlyBird.deadline}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Status</p>
              <Badge variant={event.earlyBird.active ? 'secondary' : 'outline'} className={event.earlyBird.active ? 'bg-primary/10 text-primary' : ''}>
                {event.earlyBird.active ? 'Active' : 'Expired'}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Discount Codes (from event data) */}
      {event.isPaid && (
        <Card className="p-4 gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              <h3 className="text-sm text-card-foreground">Discount Codes</h3>
            </div>
            <Button variant="link" size="sm" onClick={() => leapy('set_tickets')} className="text-primary h-auto p-0">
              <Sparkles className="size-3" />
              Add Code
            </Button>
          </div>
          {discountCodes.length > 0 ? (
            <div className="space-y-2">
              {discountCodes.map((code, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-card-foreground font-mono">{code.code}</p>
                      <button onClick={() => { copyToClipboard(code.code); toast.success('Code copied!'); }}>
                        <Copy className="size-3 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {code.discountType === 'fixed' ? `$${code.discountAmount} off` : `${code.discountPercent}% off`}
                      {code.maxUses && ` · ${code.usedCount || 0}/${code.maxUses} used`}
                      {code.description && ` · ${code.description}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {code.maxUses && (
                      <Progress value={((code.usedCount || 0) / code.maxUses) * 100} className="w-12 h-1" />
                    )}
                    <button
                      onClick={() => {
                        removeDiscountCode(event.id, code.code);
                        toast.success('Code removed');
                      }}
                      className="p-1 hover:bg-destructive/10 rounded"
                    >
                      <Trash2 className="size-3 text-destructive/60" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">No discount codes yet</p>
          )}
        </Card>
      )}

      {/* Credit Conversion Reference */}
      {event.isPaid && (
        <Card className="p-4 gap-2 bg-amber-50/50 border-amber-200/50">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-amber-500" />
            <h3 className="text-sm text-card-foreground">Credit Conversion</h3>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Learners see ticket prices in credits, not dollars. The current rate is <span className="text-card-foreground">$1 = {CREDITS_PER_USD} credits</span>.
          </p>
          <div className="bg-card border border-border rounded-lg p-3 space-y-1.5">
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{ticket.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">${ticket.price}</span>
                    <span className="text-[10px] text-muted-foreground">=</span>
                    <span className="text-xs text-amber-600">{usdToCredits(ticket.price).toLocaleString()} credits</span>
                  </div>
                </div>
              ))
            ) : event.price ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ticket</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">${event.price}</span>
                  <span className="text-[10px] text-muted-foreground">=</span>
                  <span className="text-xs text-amber-600">{usdToCredits(event.price).toLocaleString()} credits</span>
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      )}

      {/* AI Suggestions */}
      <Card className="p-4 gap-2 bg-primary/5 border-primary/20">
        <h3 className="text-sm text-card-foreground">AI Ticket Actions</h3>
        <Button variant="secondary" onClick={() => leapy('set_tickets')} className="w-full justify-start bg-card hover:bg-accent">
          <Sparkles className="size-4 text-primary" />
          <span className="flex-1 text-left">Suggest optimal pricing</span>
        </Button>
        {tickets.length <= 1 && event.isPaid && (
          <Button variant="secondary" onClick={() => leapy('set_tickets')} className="w-full justify-start bg-card hover:bg-accent">
            <Sparkles className="size-4 text-primary" />
            <span className="flex-1 text-left">Create VIP tier</span>
          </Button>
        )}
      </Card>
    </div>
  );
}