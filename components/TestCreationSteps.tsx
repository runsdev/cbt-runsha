import React from "react";
import { TestState } from "@/types";

interface TestCreationStepsProps {
  currentStep: TestState["currentStep"];
  onChange: (step: TestState["currentStep"]) => void;
}

export default function TestCreationSteps({
  currentStep,
  onChange,
}: TestCreationStepsProps) {
  const steps = [
    { id: "test-info", name: "Test Information" },
    { id: "questions", name: "Questions" },
    { id: "review", name: "Review" },
  ] as const;

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.id} className="md:flex-1">
              <button
                onClick={() => onChange(step.id)}
                className={`flex flex-col py-2 px-4 w-full border-l-4 md:border-l-0 md:border-t-4 ${
                  currentStep === step.id
                    ? "border-primary text-primary"
                    : index < steps.findIndex((s) => s.id === currentStep)
                      ? "border-green-500 text-green-500"
                      : "border-border text-muted-foreground"
                }`}
              >
                <span className="text-xs">{`Step ${index + 1}`}</span>
                <span className="text-sm font-medium">{step.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
