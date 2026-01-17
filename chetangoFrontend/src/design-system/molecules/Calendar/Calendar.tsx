import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CalendarProps {
  /** Selected date */
  selected?: Date;
  /** Callback when date is selected */
  onSelect?: (date: Date | undefined) => void;
  /** Dates that should be enabled (all others will be disabled) */
  enabledDates?: Date[];
  /** Minimum date that can be selected */
  fromDate?: Date;
  /** Maximum date that can be selected */
  toDate?: Date;
  /** Default month to display */
  defaultMonth?: Date;
  /** Show days outside the current month */
  showOutsideDays?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Glass-styled Calendar component for date selection
 * Supports date range restriction and specific enabled dates
 */
export function Calendar({
  className,
  showOutsideDays = true,
  enabledDates,
  fromDate,
  toDate,
  selected,
  onSelect,
  defaultMonth,
}: CalendarProps) {
  // Build disabled matcher: disable dates not in enabledDates array
  const disabledMatcher = enabledDates
    ? (date: Date) => {
        const isEnabled = enabledDates.some(
          (enabledDate) =>
            enabledDate.getFullYear() === date.getFullYear() &&
            enabledDate.getMonth() === date.getMonth() &&
            enabledDate.getDate() === date.getDate()
        );
        return !isEnabled;
      }
    : undefined;

  const calendarClassNames = {
    months: 'flex flex-col sm:flex-row gap-2',
    month: 'flex flex-col gap-4',
    month_caption: 'flex justify-center pt-1 relative items-center w-full',
    caption_label: 'text-sm font-medium text-[#f9fafb]',
    nav: 'flex items-center gap-1',
    button_previous: cn(
      'absolute left-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
      'text-[#d1d5db] hover:text-[#f9fafb] transition-colors'
    ),
    button_next: cn(
      'absolute right-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
      'text-[#d1d5db] hover:text-[#f9fafb] transition-colors'
    ),
    month_grid: 'w-full border-collapse space-x-1',
    weekdays: 'flex',
    weekday: 'text-[#6b7280] rounded-md w-8 font-normal text-[0.8rem]',
    week: 'flex w-full mt-2',
    day: cn(
      'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
      '[&:has([aria-selected])]:bg-[rgba(201,52,72,0.2)] [&:has([aria-selected])]:rounded-md'
    ),
    day_button: cn(
      'size-8 p-0 font-normal',
      'text-[#d1d5db] hover:text-[#f9fafb]',
      'hover:bg-[rgba(255,255,255,0.1)] rounded-md transition-colors',
      'aria-selected:opacity-100'
    ),
    selected: cn(
      'bg-[#c93448] text-[#f9fafb]',
      'hover:bg-[#c93448] hover:text-[#f9fafb]',
      'focus:bg-[#c93448] focus:text-[#f9fafb]',
      'rounded-md'
    ),
    today: 'bg-[rgba(255,255,255,0.1)] text-[#f9fafb] rounded-md',
    outside: 'text-[#6b7280] opacity-50',
    disabled: 'text-[#6b7280] opacity-30 cursor-not-allowed hover:bg-transparent',
    hidden: 'invisible',
  };

  const chevronComponent = ({ orientation }: { orientation?: 'left' | 'right' | 'up' | 'down' }) =>
    orientation === 'left' ? (
      <ChevronLeft className="size-4" />
    ) : (
      <ChevronRight className="size-4" />
    );

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      showOutsideDays={showOutsideDays}
      defaultMonth={defaultMonth}
      className={cn('p-3', className)}
      classNames={calendarClassNames}
      components={{
        Chevron: chevronComponent,
      }}
      disabled={disabledMatcher}
      startMonth={fromDate}
      endMonth={toDate}
    />
  );
}
