"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DateSelector from "../../components/booking/DateSelector";
import TimeSelector from "../../components/booking/TimeSelector";

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

interface TimeSlot {
  time: string;
  available: boolean;
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
      "Have a quick question or need basic account assistance? Our representatives are here to help.",
    durationMinutes: 30,
  },
  {
    id: 2,
    name: "Financial Planning",
    description:
      "Discuss your long-term goals, investment strategies, and retirement planning with an advisor.",
    durationMinutes: 60,
  },
  {
    id: 3,
    name: "Mortgage Services",
    description:
      "Explore home loan options, refinancing, or get pre-approved for your next property purchase.",
    durationMinutes: 60,
  },
  {
    id: 4,
    name: "Account Management",
    description:
      "Open new accounts, update personal information, or resolve complex account-related issues.",
    durationMinutes: 45,
  },
];

const mockTimeSlots: TimeSlot[] = [
  {
    time: "09:00",
    available: true,
  },
  {
    time: "09:30",
    available: true,
  },
  {
    time: "10:00",
    available: true,
  },
  {
    time: "10:30",
    available: false,
  },
  {
    time: "11:00",
    available: true,
  },
  {
    time: "11:30",
    available: true,
  },
  {
    time: "13:00",
    available: true,
  },
  {
    time: "13:30",
    available: true,
  },
];

export default function SelectTimePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const branchId = searchParams.get("branchId");
  const serviceId = searchParams.get("serviceId");

  const [selectedDate, setSelectedDate] = useState<Date>(
    getInitialDate(),
  );

  const [selectedTime, setSelectedTime] = useState<string | null>(
    null,
  );

  const branch = branches.find(
    (item) => item.id === Number(branchId),
  );

  const service = appointmentTypes.find(
    (item) => item.id === Number(serviceId),
  );

  const dates = useMemo(() => {
    return getBookingDates(5);
  }, []);

  const handleBack = () => {
    if (branchId) {
      router.push(`/booking/service?branchId=${branchId}`);
    } else {
      router.push("/booking");
    }
  };

  const handleConfirm = () => {
    if (!branchId || !serviceId || !selectedDate || !selectedTime) {
      return;
    }

    const date = formatDateForUrl(selectedDate);

    router.push(
      `/booking/confirmation?branchId=${branchId}&serviceId=${serviceId}&date=${date}&time=${selectedTime}`,
    );
  };

  /*
   * If someone manually navigates to /booking/time without
   * the required parameters, send them back to the start.
   */
  if (!branch || !service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4">
        <div className="rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-[#76777d]">
            error
          </span>

          <h2 className="mt-3 text-lg font-semibold">
            Booking information is missing
          </h2>

          <p className="mt-2 text-sm text-[#76777d]">
            Please start the booking process again.
          </p>

          <button
            type="button"
            onClick={() => router.push("/booking")}
            className="mt-6 h-11 rounded-lg bg-black px-6 text-sm font-semibold text-white"
          >
            Start Booking
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e] md:pb-0">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e0e3e5] bg-white">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center px-4 md:px-6">

          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="mr-3 rounded-full p-2 text-[#45464d] transition hover:bg-[#eceef0]"
          >
            <span className="material-symbols-outlined">
              arrow_back
            </span>
          </button>

          <h1 className="text-base font-bold tracking-tight text-black">
            Branch Booking
          </h1>

        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6">

        {/* Progress */}
        <BookingProgress />

        {/* Booking summary */}
        <section className="rounded-lg border border-[#c6c6cd] bg-white p-4 shadow-[0px_4px_12px_rgba(15,23,42,0.05)]">

          <div className="flex items-center gap-3">

            <span className="material-symbols-outlined text-[#006c49]">
              storefront
            </span>

            <div>
              <h2 className="text-base font-semibold">
                {branch.name}
              </h2>

              <p className="text-sm text-[#45464d]">
                {branch.address}
              </p>
            </div>

          </div>

          <div className="my-3 border-t border-[#e0e3e5]" />

          <div className="flex items-center gap-3">

            <span className="material-symbols-outlined text-[#006c49]">
              work
            </span>

            <div>
              <h2 className="text-base font-semibold">
                {service.name}
              </h2>

              <p className="text-sm text-[#45464d]">
                {service.durationMinutes} minutes
              </p>
            </div>

          </div>

        </section>

        {/* Date */}
        <section>

          <h2 className="mb-4 text-xl font-semibold">
            Select a Date
          </h2>

          <DateSelector
            dates={dates}
            selectedDate={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
          />

        </section>

        {/* Time */}
        <section>

          <h2 className="mb-4 text-xl font-semibold">
            Available Times
          </h2>

          <TimeSelector
            times={mockTimeSlots}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
          />

        </section>

        {/* Action */}
        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={handleBack}
            className="flex h-12 items-center justify-center rounded-lg border border-[#c6c6cd] bg-white px-7 text-sm font-semibold transition hover:bg-[#eceef0]"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!selectedTime}
            onClick={handleConfirm}
            className="flex h-14 items-center justify-center rounded-lg bg-[#006c49] px-8 text-sm font-semibold text-white shadow-[0px_4px_12px_rgba(0,108,73,0.2)] transition hover:bg-[#005236] disabled:cursor-not-allowed disabled:bg-[#e0e3e5] disabled:text-[#76777d] disabled:shadow-none"
          >
            Confirm Appointment

            <span className="material-symbols-outlined ml-2 text-[18px]">
              arrow_forward
            </span>
          </button>

        </div>

      </main>

      {/* Mobile navigation */}
      <MobileBookingNavigation />

    </main>
  );
}

/* ---------------------------------------------------------
   Progress
--------------------------------------------------------- */

function BookingProgress() {
  const steps = [
    {
      number: 1,
      label: "Branch",
      completed: true,
    },
    {
      number: 2,
      label: "Service",
      completed: true,
    },
    {
      number: 3,
      label: "Time",
      active: true,
    },
    {
      number: 4,
      label: "Done",
      active: false,
    },
  ];

  return (
    <div className="rounded-xl bg-white px-4 py-5 shadow-[0px_4px_12px_rgba(15,23,42,0.05)] md:px-6">

      <div className="relative flex items-start justify-between">

        {/* Background */}
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-[#e0e3e5]" />

        {/* Completed progress */}
        <div className="absolute left-[12.5%] top-4 h-0.5 w-[50%] bg-black" />

        {steps.map((step) => (
          <div
            key={step.number}
            className="relative z-10 flex flex-col items-center gap-2"
          >

            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                step.completed || step.active
                  ? "bg-black text-white"
                  : "bg-[#e0e3e5] text-[#45464d]"
              } ${
                step.active
                  ? "ring-4 ring-[#dae2fd]"
                  : ""
              }`}
            >
              {step.completed ? (
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
              ) : (
                step.number
              )}
            </div>

            <span
              className={`text-xs font-medium ${
                step.active
                  ? "font-bold text-black"
                  : "text-[#45464d]"
              }`}
            >
              {step.label}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

/* ---------------------------------------------------------
   Mobile Navigation
--------------------------------------------------------- */

function MobileBookingNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-[#e0e3e5] bg-white px-4 shadow-[0px_-4px_12px_rgba(15,23,42,0.05)] md:hidden">

      <div className="flex flex-col items-center justify-center p-2 text-[#76777d]">
        <span className="material-symbols-outlined">
          location_on
        </span>

        <span className="mt-1 text-[10px] font-semibold">
          Branches
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-2 text-[#76777d]">
        <span className="material-symbols-outlined">
          settings_suggest
        </span>

        <span className="mt-1 text-[10px] font-semibold">
          Services
        </span>
      </div>

      <div className="flex flex-col items-center justify-center rounded-full bg-[#6cf8bb] px-4 py-1 text-[#005236]">
        <span
          className="material-symbols-outlined"
          style={{
            fontVariationSettings: "'FILL' 1",
          }}
        >
          calendar_month
        </span>

        <span className="mt-1 text-[10px] font-semibold">
          Schedule
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-2 text-[#76777d]">
        <span className="material-symbols-outlined">
          check_circle
        </span>

        <span className="mt-1 text-[10px] font-semibold">
          Confirm
        </span>
      </div>

    </nav>
  );
}

/* ---------------------------------------------------------
   Date helpers
--------------------------------------------------------- */

function getInitialDate() {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
}

function getBookingDates(numberOfDays: number) {
  const dates: Date[] = [];

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(today);

    date.setDate(today.getDate() + i);

    dates.push(date);
  }

  return dates;
}

function formatDateForUrl(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}