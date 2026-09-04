"use client";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSelectorProps {
  times: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export default function TimeSelector({
  times,
  selectedTime,
  onSelect,
}: TimeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
      {times.map((slot) => {
        const selected = selectedTime === slot.time;

        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            className={`rounded-lg px-2 py-3 text-center text-sm font-medium transition ${
              !slot.available
                ? "cursor-not-allowed border border-[#c6c6cd] bg-[#f2f4f6] text-[#76777d] opacity-50"
                : selected
                  ? "border-2 border-[#006c49] bg-[#006c49]/10 text-[#006c49] font-bold"
                  : "border border-[#c6c6cd] bg-white text-[#191c1e] hover:border-black"
            }`}
          >
            {formatTime(slot.time)}
          </button>
        );
      })}
    </div>
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}