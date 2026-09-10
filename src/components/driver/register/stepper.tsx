type Step = 1 | 2 | 3 | 4;

interface StepperProps {
  currentStep: Step;
}

const steps = [
  { number: 1, label: "Personal Details" },
  { number: 2, label: "Contact & Address Info" },
  { number: 3, label: "Documents" },
  { number: 4, label: "Review" },
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="mb-10 px-4  relative z-0">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center z-10 bg-[#f8f9fb] dark:bg-slate-900 px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  isCompleted || isCurrent
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-sm">
                    check
                  </span>
                ) : (
                  step.number
                )}
              </div>
            </div>
          );
        })}
        <div className="absolute top-5 left-0 w-full flex">
          <div
            className={`h-[2px] w-1/3 transition-colors ${
              currentStep > 1 ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
            }`}
          ></div>
          <div
            className={`h-[2px] w-1/3 transition-colors ${
              currentStep > 2 ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
            }`}
          ></div>
          <div
            className={`h-[2px] w-1/3 transition-colors ${
              currentStep > 3 ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
            }`}
          ></div>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs font-semibold text-slate-400">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`w-20 text-center transition-colors ${
              currentStep >= step.number ? "text-primary" : ""
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
