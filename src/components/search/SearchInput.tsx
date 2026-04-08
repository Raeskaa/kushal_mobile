import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  onClear, 
  autoFocus = true,
  placeholder = "Search communities, courses, events..."
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative border-b border-gray-200 bg-white">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 pl-14 pr-14 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
}
