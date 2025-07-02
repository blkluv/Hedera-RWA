import React from "react";

interface ProgressTrackerProps {
  currentStep: number;
  steps: string[];
  error?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  steps,
  error,
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-2">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center gap-1 ${
              idx < currentStep
                ? "text-green-600"
                : idx === currentStep
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            <span className="font-semibold">{step}</span>
            {idx < steps.length - 1 && <span className="mx-2">→</span>}
          </div>
        </React.Fragment>
      ))}
    </div>
    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
  </div>
);

export default ProgressTracker;
