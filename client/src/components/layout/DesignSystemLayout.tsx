import { cn } from '../../lib/utils';

type MaxWidth = '6xl' | '3xl' | '2xl' | 'md';

const maxWidthClasses: Record<MaxWidth, string> = {
  '6xl': 'max-w-6xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  md: 'max-w-md',
};

type DesignSystemLayoutProps = {
  children: React.ReactNode;
  maxWidth?: MaxWidth;
  centered?: boolean;
  className?: string;
};

export function DesignSystemLayout({
  children,
  maxWidth = '6xl',
  centered = false,
  className,
}: DesignSystemLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-canvas font-sans text-ink antialiased',
        centered && 'flex items-center justify-center',
        className,
      )}
    >
      <div className={cn('mx-auto w-full px-4 py-8 sm:px-8', maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </div>
  );
}
