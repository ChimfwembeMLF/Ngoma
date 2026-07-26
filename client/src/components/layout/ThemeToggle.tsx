import { Moon, Sun, Monitor } from 'lucide-react';
import { useColorMode } from '@/providers/ColorModeProvider';
import { Button } from '@/components/ui/button';

const LABELS = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
} as const;

export function ThemeToggle() {
  const { mode, cycleMode } = useColorMode();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={cycleMode}
      aria-label={`Theme: ${LABELS[mode]}. Click to switch.`}
      title={`Theme: ${LABELS[mode]} (click to cycle)`}
      className="normal-case tracking-normal"
    >
      {mode === 'light' && <Sun className="size-4" aria-hidden />}
      {mode === 'dark' && <Moon className="size-4" aria-hidden />}
      {mode === 'system' && <Monitor className="size-4" aria-hidden />}
    </Button>
  );
}
