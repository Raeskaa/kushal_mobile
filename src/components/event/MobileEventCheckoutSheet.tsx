import { useMemo, useState } from 'react';
import { Check, CreditCard, Minus, Percent, Plus, Ticket } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type MockEvent } from '../../data/mockEventData';
import { useCredits, usdToCredits } from '../../data/CreditContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

interface MobileEventCheckoutSheetProps {
  open: boolean;
  onClose: () => void;
  event: MockEvent;
  initialTicketId?: string | null;
  onComplete?: () => void;
}

export function MobileEventCheckoutSheet({ open, onClose, event, initialTicketId, onComplete }: MobileEventCheckoutSheetProps) {
  const credits = useCredits();
  const tickets = event.tickets && event.tickets.length > 0
    ? event.tickets
    : [{ id: 'default', name: 'General Admission', price: event.price || 0, currency: event.currency || 'USD', quantity: 999, remaining: 999, description: 'Standard admission' }];

  const [selectedTicketId, setSelectedTicketId] = useState(initialTicketId || tickets[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) || tickets[0];
  const subtotal = (selectedTicket?.price || 0) * quantity;
  const hasDiscount = discountCode.trim().toUpperCase() === 'EARLYBIRD';
  const discountAmount = hasDiscount ? Math.round(subtotal * 0.2) : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const totalCredits = usdToCredits(total);
  const canAfford = credits.canAfford(totalCredits);

  const completePurchase = () => {
    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      toast.success('Ticket confirmed');
      onComplete?.();
      onClose();
    }, 900);
  };

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0 max-h-[92vh] overflow-y-auto">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-[17px]">Checkout</SheetTitle>
          <p className="text-[12px] text-muted-foreground">Choose tickets for {event.title}</p>
        </SheetHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            {tickets.map((ticket) => {
              const isActive = ticket.id === selectedTicketId;
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left border rounded-xl p-3 transition-all ${isActive ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-card-foreground">{ticket.name}</p>
                      <p className="text-[11px] text-muted-foreground">{ticket.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-card-foreground">${ticket.price}</p>
                      <p className="text-[10px] text-amber-600">{usdToCredits(ticket.price).toLocaleString()} credits</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm text-card-foreground">Quantity</p>
              <p className="text-[11px] text-muted-foreground">Adjust seats for this order</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus className="size-4" /></Button>
              <span className="w-8 text-center text-sm text-card-foreground">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity((value) => Math.min(10, value + 1))}><Plus className="size-4" /></Button>
            </div>
          </div>

          <div className="rounded-xl border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Percent className="size-4 text-muted-foreground" />
              <p className="text-sm text-card-foreground">Discount Code</p>
            </div>
            <Input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Try EARLYBIRD" />
          </div>

          <div className="rounded-xl border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-muted-foreground" />
              <p className="text-sm text-card-foreground">Payment Details</p>
            </div>
            <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
              <Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" />
            </div>
          </div>

          <div className="rounded-xl bg-muted p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">${subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-card-foreground">-${discountAmount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-card-foreground">Total</span>
              <div className="text-right">
                <p className="text-card-foreground">${total}</p>
                <p className="text-[11px] text-amber-600">{totalCredits.toLocaleString()} credits</p>
              </div>
            </div>
          </div>

          {!canAfford && total > 0 && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-[12px] text-destructive">Not enough credits for this purchase.</p>
            </div>
          )}

          <Button
            onClick={completePurchase}
            disabled={processing || !selectedTicket || !cardNumber || !expiry || !cvc || (!canAfford && total > 0)}
            className="w-full"
          >
            {processing ? 'Processing...' : 'Complete Purchase'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
