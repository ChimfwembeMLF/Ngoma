import { cn } from '../../lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md';
};

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-hairline bg-canvas text-ink',
        padding === 'md' ? 'p-6' : 'p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
