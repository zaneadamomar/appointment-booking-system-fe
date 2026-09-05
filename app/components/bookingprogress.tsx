interface BookingProgressProps {
  currentStep: number;
}

export default function BookingProgress({
  currentStep,
}: BookingProgressProps) {
  const steps = [
    {
      number: 1,
      label: "Branch",
    },
    {
      number: 2,
      label: "Service",
    },
    {
      number: 3,
      label: "Time",
    },
    {
      number: 4,
      label: "Done",
    },
  ];

  return (
    <div className="rounded-xl bg-white px-4 py-5 shadow-[0px_4px_12px_rgba(15,23,42,0.05)] md:px-6">
      <div className="relative flex items-start justify-between">

        {/* Background Progress Line */}
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-[#e0e3e5]" />

        {/* Completed Progress Line */}
        <div
          className="absolute left-[12.5%] top-4 h-0.5 bg-black transition-all"
          style={{
            width:
              currentStep === 1
                ? "0%"
                : currentStep === 2
                ? "25%"
                : currentStep === 3
                ? "50%"
                : "75%",
          }}
        />

        {steps.map((step) => {
          const completed =
            step.number < currentStep;

          const active =
            step.number === currentStep;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  completed || active
                    ? "bg-black text-white"
                    : "bg-[#e0e3e5] text-[#45464d]"
                } ${
                  active
                    ? "ring-4 ring-[#dae2fd]"
                    : ""
                }`}
              >
                {completed ? (
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                ) : (
                  step.number
                )}
              </div>

              <span
                className={`text-xs font-medium ${
                  active
                    ? "font-bold text-black"
                    : "text-[#45464d]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
