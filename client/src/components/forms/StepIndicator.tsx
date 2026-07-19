import { cn } from '@/lib/utils';

export type StepIndicatorItem = {
  id: string;
  label: string;
};

type StepIndicatorProps = {
  steps: StepIndicatorItem[];
  currentIndex: number;
  className?: string;
};

export function StepIndicator({ steps, currentIndex, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn('mb-6', className)}>
      <ol className="flex items-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  isActive && 'bg-primary text-primary-foreground',
                  isComplete && 'bg-primary/20 text-primary',
                  !isActive && !isComplete && 'bg-muted text-muted-foreground',
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  'hidden truncate text-sm sm:inline',
                  isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'ml-auto hidden h-px flex-1 sm:block',
                    isComplete ? 'bg-primary/40' : 'bg-border',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
