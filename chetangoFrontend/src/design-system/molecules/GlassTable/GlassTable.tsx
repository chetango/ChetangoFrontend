import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassTableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Container className for the scrollable wrapper */
  containerClassName?: string;
  /** Whether to show the glass container styling (default: true) */
  showContainer?: boolean;
}

const GlassTable = React.forwardRef<HTMLTableElement, GlassTableProps>(
  ({ className, containerClassName, showContainer = true, ...props }, ref) => (
    <div
      className={cn(
        'relative w-full overflow-x-auto',
        // Glass container styling - only if showContainer is true
        showContainer && [
          'backdrop-blur-xl',
          'bg-[rgba(26,26,32,0.5)]',
          'border border-[rgba(255,255,255,0.1)]',
          'rounded-xl',
          'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        ],
        containerClassName
      )}
    >
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
);
GlassTable.displayName = 'GlassTable';

const GlassTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      '[&_tr]:border-b [&_tr]:border-[rgba(255,255,255,0.08)]',
      'bg-[rgba(255,255,255,0.02)]',
      className
    )}
    {...props}
  />
));
GlassTableHeader.displayName = 'GlassTableHeader';

const GlassTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
GlassTableBody.displayName = 'GlassTableBody';

const GlassTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'bg-[rgba(255,255,255,0.05)]',
      'border-t border-[rgba(255,255,255,0.1)]',
      'font-medium',
      '[&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
GlassTableFooter.displayName = 'GlassTableFooter';

const GlassTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-[rgba(255,255,255,0.05)]',
      'transition-colors duration-200',
      'group',
      // Hover state
      'hover:bg-[rgba(255,255,255,0.03)]',
      // Selected state
      'data-[state=selected]:bg-[rgba(201,52,72,0.1)]',
      className
    )}
    {...props}
  />
));
GlassTableRow.displayName = 'GlassTableRow';

const GlassTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-8 py-5 text-left align-middle font-medium',
      'text-[#9ca3af] text-[12px] uppercase tracking-[0.1em]',
      'whitespace-nowrap',
      '[&:has([role=checkbox])]:pr-0',
      '[&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
GlassTableHead.displayName = 'GlassTableHead';

const GlassTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'px-8 py-6 align-middle',
      'text-[#d1d5db]',
      'whitespace-nowrap',
      '[&:has([role=checkbox])]:pr-0',
      '[&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
GlassTableCell.displayName = 'GlassTableCell';

const GlassTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-[#6b7280]', className)}
    {...props}
  />
));
GlassTableCaption.displayName = 'GlassTableCaption';

export {
  GlassTable,
  GlassTableHeader,
  GlassTableBody,
  GlassTableFooter,
  GlassTableHead,
  GlassTableRow,
  GlassTableCell,
  GlassTableCaption,
};
