import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export default function Steps({ steps, currentStep }: StepsProps) {
  return (
    <nav aria-label="Progresso">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center",
                !isLast && "flex-1"
              )}
            >
              {/* Step circle and name */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                    isCompleted && "bg-accent-green text-white",
                    isCurrent && "bg-primary text-white",
                    !isCompleted && !isCurrent && "bg-neutral-200 text-neutral-500"
                  )}
                >
                  {isCompleted ? <Check size={20} /> : step.id}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-[100px]",
                    isCurrent ? "text-primary" : "text-neutral-500"
                  )}
                >
                  {step.name}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-4 rounded",
                    isCompleted ? "bg-accent-green" : "bg-neutral-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
