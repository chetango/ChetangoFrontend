import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variant of the skeleton */
  variant?: 'default' | 'circular' | 'text';
  /** Width of the skeleton (for text variant) */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
}

/**
 * Glass-styled Skeleton component with shimmer animation
 * Used for loading states
 */
function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        // Base styles
        'relative overflow-hidden',
        // Glass background
        'bg-[rgba(255,255,255,0.05)]',
        // Shimmer animation
        'before:absolute before:inset-0',
        'before:-translate-x-full',
        'before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r',
        'before:from-transparent',
        'before:via-[rgba(255,255,255,0.08)]',
        'before:to-transparent',
        // Variant styles
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'default' && 'rounded-lg',
        className
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...props}
    />
  );
}

// Preset skeleton components for common use cases
function SkeletonText({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="text" className={cn('h-4 w-full', className)} {...props} />;
}

function SkeletonAvatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      variant="circular"
      className={cn('size-10', className)}
      {...props}
    />
  );
}

function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      variant="default"
      className={cn('h-10 w-24 rounded-xl', className)}
      {...props}
    />
  );
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      variant="default"
      className={cn('h-32 w-full rounded-xl', className)}
      {...props}
    />
  );
}

function SkeletonTableRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-4 p-4', className)} {...props}>
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-1/2" />
      </div>
      <SkeletonButton />
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTableRow,
};
