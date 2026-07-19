import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type QuickAction = {
  label: string;
  to: string;
  description?: string;
};

type QuickActionGridProps = {
  actions: QuickAction[];
  className?: string;
};

export function QuickActionGrid({ actions, className }: QuickActionGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {actions.map((action) => (
        <Link key={action.to} to={action.to} className="group block">
          <Card
            size="sm"
            className="h-full transition-colors hover:bg-muted/50"
          >
            <CardContent>
              <div className="font-medium text-foreground group-hover:text-primary">{action.label}</div>
              {action.description && (
                <div className="mt-1 text-sm text-muted-foreground">{action.description}</div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
