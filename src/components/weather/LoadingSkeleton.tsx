import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      {/* Main weather card skeleton */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-4 rounded skeleton-shimmer" />
          <div className="h-5 w-32 rounded skeleton-shimmer" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full skeleton-shimmer" />
          <div className="space-y-3">
            <div className="h-16 sm:h-20 w-32 rounded skeleton-shimmer" />
            <div className="h-5 w-24 rounded skeleton-shimmer" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
          ))}
        </div>
      </div>

      {/* AQI and Forecast skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-28 rounded skeleton-shimmer" />
            <div className="h-6 w-20 rounded-full skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg skeleton-shimmer" />
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="h-6 w-32 rounded skeleton-shimmer mb-6" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
