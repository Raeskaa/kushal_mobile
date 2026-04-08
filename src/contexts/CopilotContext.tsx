import { createContext, useContext, useState, ReactNode } from 'react';

interface CurrentFocus {
  type: 'field' | 'section' | 'page';
  name: string;
  value?: string;
}

interface CopilotContextType {
  currentFocus: CurrentFocus | undefined;
  setCurrentFocus: (focus: CurrentFocus | undefined) => void;
  applySuggestion: (suggestion: any) => void;
  onSuggestionApplied?: (suggestion: any) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function CopilotProvider({ children, onSuggestionApplied }: { children: ReactNode; onSuggestionApplied?: (suggestion: any) => void }) {
  const [currentFocus, setCurrentFocus] = useState<CurrentFocus | undefined>();

  const applySuggestion = (suggestion: any) => {
    if (onSuggestionApplied) {
      onSuggestionApplied(suggestion);
    }
  };

  return (
    <CopilotContext.Provider value={{ currentFocus, setCurrentFocus, applySuggestion, onSuggestionApplied }}>
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilot must be used within CopilotProvider');
  }
  return context;
}
