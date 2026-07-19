import { cn } from '@/lib/utils';

type OperatorOptionProps = {
  displayName: string;
  selected: boolean;
  onSelect: () => void;
};

export function OperatorOption({ displayName, selected, onSelect }: OperatorOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors',
        selected
          ? 'border-primary bg-muted/50 ring-1 ring-primary'
          : 'border-border hover:border-primary/50',
      )}
    >
      <span className="text-lg" aria-hidden>
        📱
      </span>
      <span className="flex-1 font-medium text-foreground">{displayName}</span>
      <span
        className={cn(
          'h-4 w-4 rounded-full border-2',
          selected ? 'border-primary bg-primary' : 'border-muted-foreground',
        )}
        aria-hidden
      />
    </button>
  );
}
