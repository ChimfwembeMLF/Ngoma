import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-active disabled:bg-primary-disabled',
  outline:
    'border border-hairline bg-canvas text-ink hover:bg-surface-soft',
  ghost: 'bg-transparent text-ink hover:bg-surface-soft',
};

export function buttonVariants(variant: ButtonVariant = 'primary', className?: string) {
  return cn(
    'inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-sm text-base font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
    'disabled:opacity-60 disabled:pointer-events-none',
    variantClasses[variant],
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonVariants(variant, className)} {...props} />;
}
