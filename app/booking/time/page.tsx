"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DateSelector from "../../components/booking/DateSelector";
import TimeSelector from "../../components/booking/TimeSelector";

import {
  getBranches,
  getServices,
  getAvailableTimeSlots,
} from "../../lib/api";

import type {
  Branch,
  AppointmentType,
  AvailableTimeSlot,
} from "../../types/booking";

interface TimeSlot {
  time: string;
  available: boolean;
}

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

  const [branch, setBranch] = useState<Branch | null>(null);
  const [service, setService] = useState<AppointmentType | null>(null);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [loadingBookingInfo, setLoadingBookingInfo] =
    useState(true);

  const [loadingTimeSlots, setLoadingTimeSlots] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  const dates = useMemo(() => {
    return getBookingDates(14);
  }, []);

  /*
   * ---------------------------------------------------------
   * Load branch and service information
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!branchId || !serviceId) {
      setLoadingBookingInfo(false);
      return;
    }

    const loadBookingInfo = async () => {
      try {
        setLoadingBookingInfo(true);
        setError(null);

        const [branches, services] = await Promise.all([
          getBranches(),
          getServices(),
        ]);

        const selectedBranch = branches.find(
          (item) => item.branchId === branchId,
        );

        const selectedService = services.find(
          (item) => item.serviceId === serviceId,
        );

        if (!selectedBranch || !selectedService) {
          setError("Booking information could not be found.");
          return;
        }

        setBranch(selectedBranch);
        setService(selectedService);
      } catch (err) {
        console.error("Failed to load booking information:", err);

        setError(
          "Unable to load the booking information. Please try again.",
        );
      } finally {
        setLoadingBookingInfo(false);
      }
    };

    loadBookingInfo();
  }, [branchId, serviceId]);

  /*
   * ---------------------------------------------------------
   * Load available time slots whenever the date changes
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!branchId || !serviceId || !selectedDate) {
      return;
    }

    const loadAvailableTimeSlots = async () => {
      try {
        setLoadingTimeSlots(true);
        setError(null);

        // Convert Date to YYYY-MM-DD
        const bookingDate = formatDateForUrl(selectedDate);

        const slots = await getAvailableTimeSlots(
          branchId,
          serviceId,
          bookingDate,
        );

        const formattedSlots: TimeSlot[] = slots.map(
          (slot: AvailableTimeSlot) => ({
            time: formatTime(slot.startTime),
            available: slot.isAvailable,
          }),
        );

        setTimeSlots(formattedSlots);

        // Clear selected time whenever the date changes
        setSelectedTime(null);
      } catch (err) {
        console.error(
          "Failed to load available time slots:",
          err,
        );

        setTimeSlots([]);
        setSelectedTime(null);

        setError(
          "Unable to load available times for this date. Please try again.",
        );
      } finally {
        setLoadingTimeSlots(false);
      }
    };

    loadAvailableTimeSlots();
  }, [branchId, serviceId, selectedDate]);

  /*
   * ---------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------
   */

  const handleBack = () => {
    if (branchId) {
      router.push(`/booking/service?branchId=${branchId}`);
    } else {
      router.push("/booking");
    }
  };

  const handleConfirm = () => {
    if (
      !branchId ||
      !serviceId ||
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    const date = formatDateForUrl(selectedDate);

    router.push(
      `/booking/confirmation?branchId=${branchId}&serviceId=${serviceId}&date=${date}&time=${selectedTime}`,
    );
  };

  /*
   * ---------------------------------------------------------
   * Missing booking information
   * ---------------------------------------------------------
   */

  if (loadingBookingInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4">
        <div className="text-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#006c49]">
            progress_activity
          </span>

          <p className="mt-3 text-sm text-[#76777d]">
            Loading booking information...
          </p>
        </div>
      </main>
    );
  }

  if (!branchId || !serviceId || !branch || !service) {
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
            {error ||
              "Please start the booking process again."}
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
                {branch.branchName}
              </h2>

              <p className="text-sm text-[#45464d]">
                {branch.addressLine1}
                {branch.addressLine2
                  ? `, ${branch.addressLine2}`
                  : ""}
                {branch.city
                  ? `, ${branch.city}`
                  : ""}
                {branch.postalCode
                  ? `, ${branch.postalCode}`
                  : ""}
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
                {service.serviceName}
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
            }}
          />
        </section>

        {/* Time */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Available Times
          </h2>

          {loadingTimeSlots ? (
            <div className="flex items-center justify-center rounded-xl border border-[#e0e3e5] bg-white py-10">
              <div className="flex items-center gap-3 text-sm text-[#76777d]">
                <span className="material-symbols-outlined animate-spin text-[#006c49]">
                  progress_activity
                </span>

                Loading available times...
              </div>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="rounded-xl border border-[#e0e3e5] bg-white px-6 py-10 text-center">
              <span className="material-symbols-outlined text-4xl text-[#76777d]">
                event_busy
              </span>

              <h3 className="mt-3 text-base font-semibold">
                No times available
              </h3>

              <p className="mt-2 text-sm text-[#76777d]">
                There are no appointment times available
                for this date.
              </p>
            </div>
          ) : (
            <TimeSelector
              times={timeSlots}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
            disabled={!selectedTime || loadingTimeSlots}
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
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-[#e0e3e5]" />

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

/*
 * Converts:
 * 09:00:00 -> 09:00
 * 13:30:00 -> 13:30
 */
function formatTime(time: string) {
  return time.substring(0, 5);
}