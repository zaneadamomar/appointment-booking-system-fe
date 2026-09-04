"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Branch {
  id: number;
  name: string;
  address: string;
}

interface AppointmentType {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
}

const branches: Branch[] = [
  {
    id: 1,
    name: "Durban Branch",
    address: "123 Smith Street, Durban, 4001",
  },
  {
    id: 2,
    name: "Umhlanga Branch",
    address: "10 Lagoon Drive, Umhlanga, 4319",
  },
  {
    id: 3,
    name: "Pietermaritzburg Branch",
    address: "45 Church Street, Pietermaritzburg, 3201",
  },
  {
    id: 4,
    name: "Westville Branch",
    address: "1 Jan Hofmeyr Road, Westville, 3629",
  },
];

const appointmentTypes: AppointmentType[] = [
  {
    id: 1,
    name: "General Inquiry",
    description:
      "Have a quick question or need basic account assistance?",
    durationMinutes: 30,
  },
  {
    id: 2,
    name: "Financial Planning",
    description:
      "Discuss your long-term goals, investment strategies, and retirement planning.",
    durationMinutes: 60,
  },
  {
    id: 3,
    name: "Mortgage Services",
    description:
      "Explore home loan options, refinancing, or get pre-approved.",
    durationMinutes: 60,
  },
  {
    id: 4,
    name: "Account Management",
    description:
      "Open new accounts, update personal information, or resolve account issues.",
    durationMinutes: 45,
  },
];

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const branchId = searchParams.get("branchId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [copied, setCopied] = useState(false);

  const branch = branches.find(
    (item) => item.id === Number(branchId),
  );

  const service = appointmentTypes.find(
    (item) => item.id === Number(serviceId),
  );

  /*
   * Temporary reference number.
   *
   * When the API is implemented this will come from
   * the booking response instead.
   */
  const referenceNumber = "BRC-" + generateReference();

  if (!branch || !service || !date || !time) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm">

          <span className="material-symbols-outlined text-5xl text-[#76777d]">
            error
          </span>

          <h1 className="mt-4 text-xl font-semibold">
            Booking information is missing
          </h1>

          <p className="mt-2 text-sm text-[#76777d]">
            We couldn't find the details for this booking.
            Please start the booking process again.
          </p>

          <button
            type="button"
            onClick={() => router.push("/booking")}
            className="mt-6 h-12 rounded-lg bg-black px-7 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Start New Booking
          </button>

        </div>
      </main>
    );
  }

  const formattedDate = formatDate(date);

  const endTime = calculateEndTime(
    time,
    service.durationMinutes,
  );

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error("Unable to copy reference number.");
    }
  };

  const handleAddToCalendar = () => {
    const startDate = `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;

    const endDate = `${date.replaceAll("-", "")}T${endTime.replace(":", "")}00`;

    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Branch Booking//Appointment//EN",
      "BEGIN:VEVENT",
      `UID:${referenceNumber}@branch-booking`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${service.name}`,
      `LOCATION:${branch.name}, ${branch.address}`,
      `DESCRIPTION:Booking Reference: ${referenceNumber}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([calendarContent], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `appointment-${referenceNumber}.ics`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 py-12 text-[#191c1e] md:py-24">

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">

        {/* Success Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#6cf8bb] shadow-lg">

          <span
            className="material-symbols-outlined text-[48px] text-[#006c49]"
            style={{
              fontVariationSettings: "'FILL' 1",
            }}
          >
            check_circle
          </span>

        </div>

        {/* Heading */}
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-black md:text-[32px]">
          Appointment Confirmed!
        </h1>

        <p className="mb-8 max-w-md text-base leading-6 text-[#45464d]">
          Your booking has been successfully scheduled.
          Please keep your booking reference for your records.
        </p>

        {/* Summary Card */}
        <section className="mb-8 w-full rounded-xl border border-[#e0e3e5] bg-white p-6 text-left shadow-[0px_4px_12px_rgba(15,23,42,0.05)] md:p-8">

          {/* Card Header */}
          <div className="mb-6 border-b border-[#e0e3e5] pb-4">
            <h2 className="text-base font-semibold text-black">
              Booking Summary
            </h2>
          </div>

          {/* Reference */}
          <div className="mb-6 flex items-start justify-between gap-4">

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#76777d]">
                Reference Number
              </p>

              <p className="text-base font-medium text-black">
                #{referenceNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyReference}
              className="flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-[#006c49] transition hover:bg-[#f2f4f6]"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? "check" : "content_copy"}
              </span>

              {copied ? "Copied" : "Copy"}
            </button>

          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Service */}
            <BookingDetail
              label="Service Type"
              icon="settings_suggest"
              value={service.name}
            />

            {/* Branch */}
            <BookingDetail
              label="Branch"
              icon="location_on"
              value={branch.name}
            />

            {/* Date */}
            <BookingDetail
              label="Date"
              icon="calendar_month"
              value={formattedDate}
            />

            {/* Time */}
            <BookingDetail
              label="Time"
              icon="schedule"
              value={`${formatTime(time)} - ${formatTime(endTime)}`}
            />

          </div>

          {/* Address */}
          <div className="mt-6 border-t border-[#e0e3e5] pt-6">

            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#76777d]">
              Branch Address
            </p>

            <div className="flex items-start gap-2">

              <span className="material-symbols-outlined text-[20px] text-[#006c49]">
                location_on
              </span>

              <p className="text-sm text-[#191c1e]">
                {branch.address}
              </p>

            </div>

          </div>

        </section>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 md:flex-row md:justify-center">

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#76777d] bg-white px-6 text-sm font-semibold text-black transition hover:bg-[#e6e8ea] md:w-auto"
          >
            <span className="material-symbols-outlined">
              event
            </span>

            Add to Calendar
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="h-12 w-full rounded-full bg-[#131b2e] px-6 text-sm font-semibold text-white transition hover:opacity-90 md:w-auto"
          >
            Return to Home
          </button>

        </div>

      </div>

    </main>
  );
}

/* ---------------------------------------------------------
   Booking Detail
--------------------------------------------------------- */

interface BookingDetailProps {
  label: string;
  icon: string;
  value: string;
}

function BookingDetail({
  label,
  icon,
  value,
}: BookingDetailProps) {
  return (
    <div>

      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#76777d]">
        {label}
      </p>

      <p className="flex items-center gap-2 text-sm text-[#191c1e]">

        <span className="material-symbols-outlined text-[20px] text-black">
          {icon}
        </span>

        {value}

      </p>

    </div>
  );
}

/* ---------------------------------------------------------
   Formatting
--------------------------------------------------------- */

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function calculateEndTime(
  startTime: string,
  durationMinutes: number,
) {
  const [hours, minutes] = startTime.split(":").map(Number);

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes + durationMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function generateReference() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";

  for (let i = 0; i < 8; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }

  return result;
}