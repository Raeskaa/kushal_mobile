import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent, type EventTicket } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Ticket, Plus, X, DollarSign, Sparkles } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { useEventStore } from '../../../data/EventStoreContext';
import { type LeapyContext } from '../../../data/leapyContexts';

interface TicketEditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  ticketId?: string; // If editing existing
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function TicketEditSheet({ isOpen, onClose, event, ticketId, onOpenLeapy }: TicketEditSheetProps) {
  const { addTicket, updateTicket } = useEventStore();
  const existing = ticketId ? event.tickets?.find(t => t.id === ticketId) : undefined;

  const [name, setName] = useState(existing?.name || '');
  const [price, setPrice] = useState(String(existing?.price ?? ''));
  const [quantity, setQuantity] = useState(String(existing?.quantity ?? '100'));
  const [description, setDescription] = useState(existing?.description || '');
  const [perks, setPerks] = useState<string[]>(existing?.perks || []);
  const [newPerk, setNewPerk] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!existing;

  const addPerk = () => {
    const trimmed = newPerk.trim();
    if (trimmed && !perks.includes(trimmed)) {
      setPerks([...perks, trimmed]);
      setNewPerk('');
    }
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error('Ticket name is required'); return; }
    if (price === '' || isNaN(Number(price))) { toast.error('Valid price is required'); return; }

    setIsSaving(true);
    setTimeout(() => {
      if (isEditing) {
        updateTicket(event.id, ticketId!, {
          name: name.trim(),
          price: Number(price),
          quantity: Number(quantity) || 100,
          description: description.trim(),
          perks,
        });
        toast.success('Ticket tier updated');
      } else {
        addTicket(event.id, {
          id: `tkt-${Date.now()}`,
          name: name.trim(),
          price: Number(price),
          quantity: Number(quantity) || 100,
          remaining: Number(quantity) || 100,
          currency: 'USD',
          description: description.trim(),
          perks,
        });
        toast.success('Ticket tier added');
      }
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const presetTiers = [
    { name: 'General Admission', price: 29, desc: 'Standard access to all sessions' },
    { name: 'VIP', price: 99, desc: 'Priority seating, networking lounge, swag bag' },
    { name: 'Early Bird', price: 19, desc: 'Limited-time discounted entry' },
  ];

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Ticket Tier' : 'Add Ticket Tier'}
      subtitle={event.title}
    >
      <div className="space-y-4">
        {/* Quick presets (new only) */}
        {!isEditing && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Quick templates</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {presetTiers.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => { setName(preset.name); setPrice(String(preset.price)); setDescription(preset.desc); }}
                  className="flex-shrink-0 px-3 py-2 bg-muted rounded-lg text-left active:bg-accent transition-all"
                >
                  <p className="text-xs text-card-foreground">{preset.name}</p>
                  <p className="text-[10px] text-muted-foreground">${preset.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Tier name</label>
            <Input
              placeholder="e.g. General Admission, VIP"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Price (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Quantity</label>
              <Input
                type="number"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Description</label>
            <Textarea
              placeholder="What's included with this ticket..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
        </div>

        {/* Perks */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Perks</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add a perk..."
              value={newPerk}
              onChange={(e) => setNewPerk(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPerk(); } }}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={addPerk} className="flex-shrink-0">
              <Plus className="size-4" />
            </Button>
          </div>
          {perks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {perks.map((perk) => (
                <Badge key={perk} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                  <span className="text-xs">{perk}</span>
                  <button onClick={() => setPerks(perks.filter(p => p !== perk))} className="p-0.5 rounded hover:bg-foreground/10">
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* AI suggestion */}
        <Button
          variant="secondary"
          onClick={() => onOpenLeapy?.({ type: 'set_tickets', entityId: event.id, entityData: event })}
          className="w-full justify-start bg-primary/5 hover:bg-primary/10"
        >
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm flex-1 text-left">Let AI suggest pricing & perks</span>
        </Button>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Ticket className="size-4" /> {isEditing ? 'Update Tier' : 'Add Tier'}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </MobileActionSheet>
  );
}
