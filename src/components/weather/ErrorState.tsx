import { AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const isLocationError = error.toLowerCase().includes('location');

  return (
    <div className={cn('glass-card p-8 text-center', className)}>
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>

      <h2 className="text-xl font-display font-semibold text-foreground mb-2">
        {isLocationError ? 'Location Access Required' : 'Something went wrong'}
      </h2>

      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {error}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-full',
            'bg-primary text-primary-foreground font-medium',
            'hover:bg-primary/90 transition-all duration-200',
            'hover:scale-105 glow-primary'
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        {isLocationError && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            <span>Or search for a city above</span>
          </div>
        )}
      </div>
    </div>
  );
}
