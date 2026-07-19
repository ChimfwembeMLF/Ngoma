import { cn } from '../../lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full min-h-[56px] rounded-sm border bg-canvas px-3 py-2 text-base text-ink',
          'placeholder:text-muted-soft',
          'focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/20',
          error ? 'border-error' : 'border-hairline',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
