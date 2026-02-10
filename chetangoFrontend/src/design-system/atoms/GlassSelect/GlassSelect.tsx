import * as SelectPrimitive from '@radix-ui/react-select';
import { clsx, type ClassValue } from 'clsx';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GlassSelect = SelectPrimitive.Root;

const GlassSelectGroup = SelectPrimitive.Group;

const GlassSelectValue = SelectPrimitive.Value;

interface GlassSelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  icon?: React.ReactNode;
}

const GlassSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  GlassSelectTriggerProps
>(({ className, children, icon, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base layout
      'flex w-full items-center justify-between gap-2',
      'px-4 py-3 text-sm',
      // Glass styling matching GlassInput
      'backdrop-blur-xl',
      'bg-[rgba(30,30,36,0.6)]',
      'border border-[rgba(255,255,255,0.12)]',
      'rounded-xl',
      'text-[#f9fafb]',
      'placeholder:text-[#6b7280]',
      // Focus states
      'focus:border-[#c93448]',
      'focus:ring-2 focus:ring-[rgba(201,52,72,0.3)]',
      'focus:outline-none',
      // Shadows
      'shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.05)]',
      'focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_0_3px_rgba(201,52,72,0.2)]',
      // Transitions
      'transition-all duration-300',
      // Disabled state
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Data placeholder styling
      'data-[placeholder]:text-[#6b7280]',
      className
    )}
    {...props}
  >
    {icon && <span className="text-[#6b7280] mr-2">{icon}</span>}
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
GlassSelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const GlassSelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="size-4 text-[#d1d5db]" />
  </SelectPrimitive.ScrollUpButton>
));
GlassSelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const GlassSelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="size-4 text-[#d1d5db]" />
  </SelectPrimitive.ScrollDownButton>
));
GlassSelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const GlassSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        // Base styles
        'relative z-[150] max-h-96 min-w-[8rem] overflow-hidden',
        'rounded-xl',
        // Glass styling
        'backdrop-blur-2xl',
        'bg-gradient-to-br from-[rgba(42,42,48,0.95)] to-[rgba(26,26,32,0.98)]',
        'border border-[rgba(255,255,255,0.15)]',
        'shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.15)]',
        'text-[#f9fafb]',
        // Position adjustments
        position === 'popper' && [
          'data-[side=bottom]:translate-y-1',
          'data-[side=left]:-translate-x-1',
          'data-[side=right]:translate-x-1',
          'data-[side=top]:-translate-y-1',
        ],
        className
      )}
      position={position}
      {...props}
    >
      <GlassSelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <GlassSelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
GlassSelectContent.displayName = SelectPrimitive.Content.displayName;

const GlassSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-xs text-[#6b7280]', className)}
    {...props}
  />
));
GlassSelectLabel.displayName = SelectPrimitive.Label.displayName;

const GlassSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Layout
      'relative flex w-full cursor-default select-none items-center',
      'rounded-lg py-2 pl-2 pr-8 text-sm outline-none',
      // Colors
      'text-[#d1d5db]',
      // Focus/hover states
      'focus:bg-[rgba(255,255,255,0.1)] focus:text-[#f9fafb]',
      'hover:bg-[rgba(255,255,255,0.08)]',
      // Disabled
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-[#c93448]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
GlassSelectItem.displayName = SelectPrimitive.Item.displayName;

const GlassSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[rgba(255,255,255,0.1)]', className)}
    {...props}
  />
));
GlassSelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    GlassSelect, GlassSelectContent, GlassSelectGroup, GlassSelectItem, GlassSelectLabel, GlassSelectScrollDownButton, GlassSelectScrollUpButton, GlassSelectSeparator, GlassSelectTrigger, GlassSelectValue
};

