const labels = ["Sponsor", "Phone", "Details", "Payment"] as const;

export type RegistrationStep = (typeof labels)[number];

export function RegistrationProgress({ step }: { step: RegistrationStep }) {
  const currentStep = labels.indexOf(step) + 1;
  return (
    <div className="registration-progress">
      <ol className="progress-indicators" aria-label={`Step ${currentStep} of ${labels.length}: ${step}`}>
        {labels.map((label, index) => {
          const position = index + 1;
          const state = position < currentStep ? " completed" : position === currentStep ? " current" : "";
          return (
            <li className="progress-step" key={label} aria-current={position === currentStep ? "step" : undefined}>
              <span className={`progress-circle${state}`} aria-hidden="true">
                {position < currentStep ? "✓" : position}
              </span>
              <span className={`progress-label${state}`}>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
