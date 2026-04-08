import { useState } from 'react';
import { CheckSquare, GripVertical, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type CustomRegistrationField, type MockEvent } from '../../data/mockEventData';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

interface MobileRegistrationFormBuilderProps {
  event: MockEvent;
}

export function MobileRegistrationFormBuilder({ event }: MobileRegistrationFormBuilderProps) {
  const { setRegistrationFields } = useEventStore();
  const [previewMode, setPreviewMode] = useState(false);
  const fields = event.customRegistrationFields || [];

  const updateField = (fieldId: string, changes: Partial<CustomRegistrationField>) => {
    setRegistrationFields(event.id, fields.map((field) => field.id === fieldId ? { ...field, ...changes } : field));
  };

  const addField = () => {
    setRegistrationFields(event.id, [
      ...fields,
      {
        id: `field-${Date.now()}`,
        type: 'text',
        label: 'New question',
        placeholder: 'Type your answer',
        required: false,
      },
    ]);
  };

  const removeField = (fieldId: string) => {
    setRegistrationFields(event.id, fields.filter((field) => field.id !== fieldId));
    toast.success('Field removed');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-card-foreground">Registration Form</h3>
          <p className="text-xs text-muted-foreground">Build the learner-facing intake form</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPreviewMode((prev) => !prev)}>
          {previewMode ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {previewMode ? (
        <Card className="p-4 gap-3">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="text-sm text-card-foreground">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea className="w-full min-h-[84px] rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder={field.placeholder} />
              ) : (
                <Input placeholder={field.placeholder} />
              )}
              {field.description && <p className="text-[11px] text-muted-foreground">{field.description}</p>}
            </div>
          ))}
        </Card>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-3 gap-3">
              <div className="flex items-center gap-2">
                <GripVertical className="size-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase">Field {index + 1}</span>
                <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground uppercase">{field.type}</span>
              </div>
              <Input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} placeholder="Field label" />
              <Input value={field.placeholder || ''} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} placeholder="Placeholder" />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => updateField(field.id, { required: !field.required })}
                  className={`text-[12px] px-3 py-1.5 rounded-full border ${field.required ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                >
                  <CheckSquare className="size-3.5 inline mr-1" /> Required
                </button>
                <Button variant="outline" size="sm" className="border-destructive/30 text-destructive" onClick={() => removeField(field.id)}>
                  <Trash2 className="size-3.5" /> Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button variant="secondary" onClick={addField} className="w-full bg-primary/10 text-primary hover:bg-primary/15">
        <Plus className="size-4" /> Add Field
      </Button>
    </div>
  );
}
