import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:bottom-4 flex max-w-sm flex-col gap-3 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold leading-none tracking-tight">Update Available</h3>
          <p className="text-sm text-muted-foreground mt-1">A new version of Ngoma is available.</p>
        </div>
        <button
          onClick={() => setNeedRefresh(false)}
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => updateServiceWorker(true)} size="sm" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload to update
        </Button>
      </div>
    </div>
  );
}
