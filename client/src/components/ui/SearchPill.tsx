import { cn } from '../../lib/utils';

type SearchPillProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchPill({
  value,
  onChange,
  placeholder = 'Search tracks...',
  className,
}: SearchPillProps) {
  return (
    <div
      className={cn(
        'flex min-h-[48px] w-full items-center rounded-full border border-hairline bg-canvas px-6 shadow-sm',
        'focus-within:border-border-strong focus-within:ring-2 focus-within:ring-primary/20',
        className,
      )}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[44px] w-full bg-transparent text-sm text-ink placeholder:text-muted outline-none"
        aria-label={placeholder}
      />
    </div>
  );
}
