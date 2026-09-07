"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBranches, getServices, createBooking, rescheduleBooking } from "../../lib/api";
import type { Branch, AppointmentType, BookingResponse, } from "../../types/booking";


export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const branchId = searchParams.get("branchId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const rescheduleBookingId = searchParams.get("rescheduleBookingId");

  const [branch, setBranch] = useState<Branch | null>(null);
  const [service, setService] = useState<AppointmentType | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const lastRequestKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const requestKey = `${rescheduleBookingId ?? "new"}-${branchId}-${serviceId}-${date}-${time}`;

    if (lastRequestKeyRef.current === requestKey) {
      return;
    }
    lastRequestKeyRef.current = requestKey;

    const createNewBooking = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!branchId || !serviceId || !date || !time) {
          throw new Error(
            "Booking information is missing. Please start the booking process again."
          );
        }

        const storedUser = sessionStorage.getItem("currentUser");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = currentUser?.userId;

        if (!userId) {
          throw new Error("You must be signed in to confirm a booking.");
        }

        const [branches, services] = await Promise.all([
          getBranches(),
          getServices(),
        ]);

        const selectedBranch = branches.find((item) => item.branchId === branchId);
        const selectedService = services.find((item) => item.serviceId === serviceId);

        if (!selectedBranch || !selectedService) {
          throw new Error("Booking information could not be found.");
        }

        if (lastRequestKeyRef.current === requestKey) {
          setBranch(selectedBranch);
          setService(selectedService);
        }

        const result = rescheduleBookingId
          ? await rescheduleBooking({
            bookingId: rescheduleBookingId,
            userId,
            branchId,
            serviceId,
            bookingDate: date,
            startTime: time,
          })
          : await createBooking({
            userId,
            branchId,
            serviceId,
            bookingDate: date,
            startTime: time,
          });

        if (result.resultCode !== 0) {
          throw new Error(result.resultMessage || "Unable to complete your booking.");
        }

        if (lastRequestKeyRef.current === requestKey) {
          setBooking(result);
        }
      } catch (err) {
        console.error("Booking creation error:", err);
        if (lastRequestKeyRef.current === requestKey) {
          setError(err instanceof Error ? err.message : "Unable to create your booking.");
        }
      } finally {
        if (lastRequestKeyRef.current === requestKey) {
          setIsLoading(false);
        }
      }
    };
    createNewBooking();
  }, [branchId, serviceId, date, time, rescheduleBookingId]);

  const handleCopyReference = async () => {
    if (!booking?.bookingId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        booking.bookingId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error(
        "Unable to copy reference number."
      );
    }
  };

  const handleAddToCalendar = () => {
    if (
      !booking?.bookingId ||
      !branch ||
      !service ||
      !date ||
      !time
    ) {
      return;
    }

    const endTime = calculateEndTime(
      time,
      service.durationMinutes
    );

    const startDate =
      `${date.replaceAll("-", "")}T${time.replace(
        ":",
        ""
      )}00`;

    const endDate =
      `${date.replaceAll("-", "")}T${endTime.replace(
        ":",
        ""
      )}00`;

    const location = [
      branch.branchName,
      branch.addressLine1,
      branch.addressLine2,
      branch.city,
      branch.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Branch Booking//Appointment//EN",
      "BEGIN:VEVENT",
      `UID:${booking.bookingId}@branch-booking`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${service.serviceName}`,
      `LOCATION:${location}`,
      `DESCRIPTION:Booking Reference: ${booking.bookingId}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob(
      [calendarContent],
      {
        type: "text/calendar;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `appointment-${booking.bookingId}.ics`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f8f1]">
            <span className="material-symbols-outlined animate-spin text-[32px] text-[#006c49]">
              progress_activity
            </span>
          </div>

          <h1 className="mt-6 text-xl font-semibold text-black">
            Confirming your appointment...
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#76777d]">
            Please wait while we create your
            booking.
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking?.bookingId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#feecec]">
            <span className="material-symbols-outlined text-[36px] text-[#b42318]">
              error
            </span>
          </div>

          <h1 className="mt-5 text-xl font-semibold text-black">
            Booking Could Not Be Created
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#76777d]">
            {error ||
              "We were unable to create your appointment."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/booking")
            }
            className="mt-6 h-12 rounded-lg bg-black px-7 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Start New Booking
          </button>
        </div>
      </main>
    );
  }

  const formattedDate = date
    ? formatDate(date)
    : "";

  const endTime =
    time && service
      ? calculateEndTime(
        time,
        service.durationMinutes
      )
      : "";

  const branchAddress = branch
    ? [
      branch.addressLine1,
      branch.addressLine2,
      branch.city,
      branch.postalCode,
    ]
      .filter(Boolean)
      .join(", ")
    : "";

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 py-12 text-[#191c1e] md:py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">

        {/* Success Icon */}

        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#6cf8bb] shadow-lg">
          <span
            className="material-symbols-outlined text-[48px] text-[#006c49]"
            style={{
              fontVariationSettings:
                "'FILL' 1",
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
          Your booking has been successfully
          scheduled. Please keep your booking
          reference for your records.
        </p>

        {/* Summary Card */}

        <section className="mb-8 w-full rounded-xl border border-[#e0e3e5] bg-white p-6 text-left shadow-[0px_4px_12px_rgba(15,23,42,0.05)] md:p-8">

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

              <p className="break-all text-base font-medium text-black">
                #{booking.bookingId}
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleCopyReference
              }
              className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-sm font-medium text-[#006c49] transition hover:bg-[#f2f4f6]"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied
                  ? "check"
                  : "content_copy"}
              </span>

              {copied
                ? "Copied"
                : "Copy"}
            </button>
          </div>

          {/* Details */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <BookingDetail
              label="Service Type"
              icon="settings_suggest"
              value={
                service?.serviceName ||
                ""
              }
            />

            <BookingDetail
              label="Branch"
              icon="location_on"
              value={
                branch?.branchName ||
                ""
              }
            />

            <BookingDetail
              label="Date"
              icon="calendar_month"
              value={formattedDate}
            />

            <BookingDetail
              label="Time"
              icon="schedule"
              value={`${formatTime(
                time || ""
              )} - ${formatTime(
                endTime
              )}`}
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
                {branchAddress}
              </p>
            </div>
          </div>

        </section>

        {/* Actions */}

        <div className="flex w-full flex-col gap-3 md:flex-row md:justify-center">

          <button
            type="button"
            onClick={
              handleAddToCalendar
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#76777d] bg-white px-6 text-sm font-semibold text-black transition hover:bg-[#e6e8ea] md:w-auto"
          >
            <span className="material-symbols-outlined">
              event
            </span>

            Add to Calendar
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="h-12 w-full rounded-full bg-[#131b2e] px-6 text-sm font-semibold text-white transition hover:opacity-90 md:w-auto"
          >
            Return to Home
          </button>

        </div>

      </div>
    </main>
  );
}

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

function formatDate(
  dateString: string
) {
  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return date.toLocaleDateString(
    "en-ZA",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatTime(
  time: string
) {
  if (!time) {
    return "";
  }

  const [
    hours,
    minutes,
  ] = time
    .split(":")
    .map(Number);

  const period =
    hours >= 12 ? "PM" : "AM";

  const displayHour =
    hours % 12 || 12;

  return `${displayHour}:${String(
    minutes
  ).padStart(
    2,
    "0"
  )} ${period}`;
}

function calculateEndTime(
  startTime: string,
  durationMinutes: number
) {
  const [
    hours,
    minutes,
  ] = startTime
    .split(":")
    .map(Number);

  const totalMinutes =
    hours * 60 +
    minutes +
    durationMinutes;

  const endHours =
    Math.floor(
      totalMinutes / 60
    ) % 24;

  const endMinutes =
    totalMinutes % 60;

  return `${String(
    endHours
  ).padStart(
    2,
    "0"
  )}:${String(
    endMinutes
  ).padStart(
    2,
    "0"
  )}`;
}
