import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { StepIndicator, type StepIndicatorItem } from './StepIndicator';
import { cn } from '@/lib/utils';

export type FormWizardStep = StepIndicatorItem & {
  content: ReactNode;
  validate?: () => boolean;
};

type FormWizardProps = {
  steps: FormWizardStep[];
  onComplete?: () => void;
  completeLabel?: string;
  finalActions?: ReactNode;
  isSubmitting?: boolean;
  className?: string;
};

export function FormWizard({
  steps,
  onComplete,
  completeLabel = 'Submit',
  finalActions,
  isSubmitting,
  className,
}: FormWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastStep = currentIndex === steps.length - 1;
  const currentStep = steps[currentIndex];

  const goBack = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goNext = () => {
    if (currentStep.validate && !currentStep.validate()) {
      return;
    }
    if (isLastStep) {
      onComplete?.();
      return;
    }
    setCurrentIndex((index) => Math.min(steps.length - 1, index + 1));
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <StepIndicator steps={steps} currentIndex={currentIndex} />

      <div className="min-h-[120px]">{currentStep.content}</div>

      <div className="sticky bottom-0 z-10 -mx-1 mt-6 flex gap-3 border-t border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {currentIndex > 0 && (
          <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>
            Back
          </Button>
        )}
        <div className="ml-auto flex flex-wrap gap-3">
          {isLastStep && finalActions ? (
            finalActions
          ) : (
            <Button type="button" variant="default" onClick={goNext} disabled={isSubmitting}>
              {isSubmitting ? 'Please wait…' : isLastStep ? completeLabel : 'Continue'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
