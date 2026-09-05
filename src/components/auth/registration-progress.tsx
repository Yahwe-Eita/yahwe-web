const labels = ["Sponsor", "Phone", "Verify", "Details", "Payment"];

interface RegistrationProgressProps {
  currentStep: number;
}

export function RegistrationProgress({ currentStep }: RegistrationProgressProps) {
  return (
    <div className="registration-progress" aria-label={`Step ${currentStep} of ${labels.length}`}>
      <div className="progress-indicators" aria-hidden="true">
        {labels.map((label, index) => {
          const step = index + 1;
          const completed = step < currentStep;
          const current = step === currentStep;

          return (
            <div className="progress-step" key={label}>
              <span
                className={`progress-circle${completed ? " completed" : ""}${current ? " current" : ""}`}
              >
                {completed ? "✓" : step}
              </span>
              <span
                className={`progress-label${completed ? " completed" : ""}${current ? " current" : ""}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <p>Step {currentStep} of {labels.length}</p>
    </div>
  );
}
