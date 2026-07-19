import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type FormTab = {
  id: string;
  label: string;
  content: ReactNode;
};

type FormTabsProps = {
  tabs: FormTab[];
  defaultTabId?: string;
  className?: string;
};

export function FormTabs({ tabs, defaultTabId, className }: FormTabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id ?? '');
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!activeTab) {
    return null;
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Form sections"
        className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            aria-controls={`form-tab-panel-${tab.id}`}
            id={`form-tab-${tab.id}`}
            onClick={() => setActiveId(tab.id)}
            className={cn(
              buttonVariants({
                variant: tab.id === activeId ? 'default' : 'outline',
                className: 'min-h-9',
              }),
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`form-tab-panel-${activeTab.id}`}
        aria-labelledby={`form-tab-${activeTab.id}`}
      >
        {activeTab.content}
      </div>
    </div>
  );
}
