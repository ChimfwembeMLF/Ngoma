import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

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
        'flex min-h-[48px] w-full items-center rounded-full border border-border bg-card px-6 shadow-sm',
        'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
        className,
      )}
    >
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[44px] border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        aria-label={placeholder}
      />
    </div>
  );
}
