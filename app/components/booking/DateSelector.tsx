"use client";

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function DateSelector({
  dates,
  selectedDate,
  onSelect,
}: DateSelectorProps) {
  return (
    <div className="hide-scrollbar flex snap-x gap-2 overflow-x-auto pb-2">
      {dates.map((date) => {
        const selected = isSameDate(date, selectedDate);

        return (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onSelect(date)}
            className={`flex h-24 w-20 shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-lg transition ${
              selected
                ? "border-2 border-black bg-black text-white shadow-md"
                : "border border-[#c6c6cd] bg-white text-[#191c1e] hover:bg-[#eceef0]"
            }`}
          >
            <span
              className={`text-xs font-medium uppercase ${
                selected
                  ? "text-white"
                  : "text-[#45464d]"
              }`}
            >
              {date.toLocaleDateString("en-ZA", {
                weekday: "short",
              })}
            </span>

            <span className="text-xl font-semibold">
              {date.getDate()}
            </span>

            <span
              className={`text-[10px] ${
                selected
                  ? "text-white/80"
                  : "text-[#76777d]"
              }`}
            >
              {date.toLocaleDateString("en-ZA", {
                month: "short",
              })}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}