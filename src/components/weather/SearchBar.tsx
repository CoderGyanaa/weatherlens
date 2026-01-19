import { useState, FormEvent, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (city: string) => Promise<void>;
  onRefreshLocation: () => Promise<void>;
  locationPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
  loading?: boolean;
  className?: string;
}

export function SearchBar({
  onSearch,
  onRefreshLocation,
  locationPermission,
  loading,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      await onSearch(query.trim());
      setQuery('');
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <form onSubmit={handleSubmit} className="relative group">
        <div
          className={cn(
            'glass-card flex items-center gap-3 px-4 py-3 transition-all duration-300',
            focused && 'ring-2 ring-primary/50 glow-primary'
          )}
        >
          <Search
            className={cn(
              'w-5 h-5 transition-colors duration-200',
              focused ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search any city..."
            disabled={loading}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm font-medium"
          />
          {!focused && !query && (
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-xs text-muted-foreground">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          )}
          {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
        </div>
      </form>

      <button
        onClick={onRefreshLocation}
        disabled={loading}
        className={cn(
          'mt-3 flex items-center gap-2 mx-auto px-4 py-2 rounded-full',
          'text-sm font-medium transition-all duration-200',
          'text-muted-foreground hover:text-primary hover:bg-primary/10',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <MapPin className="w-4 h-4" />
        <span>Use my location</span>
        {locationPermission === 'denied' && (
          <span className="text-xs text-destructive">(blocked)</span>
        )}
      </button>
    </div>
  );
}
