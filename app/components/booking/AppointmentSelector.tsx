"use client";

import type { AppointmentType } from "../../types/booking";

interface AppointmentSelectorProps {
  appointments: AppointmentType[];
  selectedAppointment: AppointmentType | null;
  onSelect: (appointment: AppointmentType) => void;
}

const icons: Record<string, string> = {
  "General Inquiry": "forum",
  "Financial Planning": "trending_up",
  "Mortgage Services": "real_estate_agent",
  "Account Management": "manage_accounts",
};

export default function AppointmentSelector({
  appointments,
  selectedAppointment,
  onSelect,
}: AppointmentSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      {appointments.map((appointment) => {
        const selected =
          selectedAppointment?.id === appointment.id;

        const icon = icons[appointment.name] ?? "event";

        return (
          <button
            key={appointment.id}
            type="button"
            onClick={() => onSelect(appointment)}
            className={`group relative flex min-h-[230px] flex-col items-start overflow-hidden rounded-xl bg-white p-5 text-left shadow-[0px_4px_12px_rgba(15,23,42,0.05)] transition-all ${
              selected
                ? "border-2 border-black shadow-md"
                : "border border-[#c6c6cd] hover:border-black hover:shadow-md"
            }`}
          >

            {/* Selected check */}
            {selected && (
              <div className="absolute right-4 top-4 text-black">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  check_circle
                </span>
              </div>
            )}

            {/* Icon */}
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                selected
                  ? "bg-[#dae2fd] text-[#131b2e]"
                  : "bg-[#e6e8ea] text-black group-hover:bg-[#dae2fd]"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {icon}
              </span>
            </div>

            {/* Name */}
            <h3
              className={`text-xl font-semibold ${
                selected
                  ? "text-black"
                  : "text-[#191c1e]"
              }`}
            >
              {appointment.name}
            </h3>

            {/* Description */}
            <p className="mt-2 line-clamp-3 text-sm leading-5 text-[#45464d]">
              {appointment.description}
            </p>

            {/* Duration */}
            <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-medium text-[#76777d]">

              <span className="material-symbols-outlined text-[17px]">
                schedule
              </span>

              <span>
                {appointment.durationMinutes} minutes
              </span>

            </div>

          </button>
        );
      })}

    </div>
  );
}