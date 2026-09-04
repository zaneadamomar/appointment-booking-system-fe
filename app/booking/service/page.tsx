"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppointmentSelector from "../../components/booking/AppointmentSelector";
import type { AppointmentType } from "../../types/booking";
import { getServices } from "../../lib/api";

export default function SelectServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const branchId = searchParams.get("branchId");

  const [services, setServices] = useState<AppointmentType[]>([]);
  const [selectedService, setSelectedService] =
    useState<AppointmentType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load services from API
  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const data = await getServices();

        setServices(data);
      } catch (err) {
        console.error("Failed to load services:", err);
        setError("Unable to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const handleBack = () => {
    if (branchId) {
      router.push(`/booking?branchId=${branchId}`);
    } else {
      router.push("/booking");
    }
  };

  const handleContinue = () => {
    if (!selectedService || !branchId) {
      return;
    }

    router.push(
      `/booking/time?branchId=${branchId}&serviceId=${selectedService.serviceId}`,
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e0e3e5] bg-white">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4 md:px-6">

          <button
            type="button"
            onClick={handleBack}
            className="mr-3 rounded-full p-2 text-[#45464d] transition hover:bg-[#eceef0]"
            aria-label="Go back"
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

      <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-4 md:px-6 md:pb-10">

        {/* Progress */}
        <BookingProgress />

        {/* Heading */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
            Select a Service
          </h2>

          <p className="mt-2 text-base text-[#45464d]">
            Choose the type of appointment you need to continue booking.
          </p>
        </section>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-[#e0e3e5] bg-white px-6 py-12 text-center">

            <span className="material-symbols-outlined animate-spin text-4xl text-[#76777d]">
              progress_activity
            </span>

            <h3 className="mt-3 text-base font-semibold">
              Loading services...
            </h3>

            <p className="mt-1 text-sm text-[#76777d]">
              Please wait while we load the available services.
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-[#ffdad6] bg-[#fff5f4] px-6 py-8 text-center">

            <span className="material-symbols-outlined text-4xl text-[#93000a]">
              error
            </span>

            <h3 className="mt-3 text-base font-semibold text-[#93000a]">
              Unable to load services
            </h3>

            <p className="mt-1 text-sm text-[#45464d]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#131b2e]"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Services */}
        {!loading && !error && services.length > 0 && (
          <AppointmentSelector
            appointments={services}
            selectedAppointment={selectedService}
            onSelect={setSelectedService}
          />
        )}

        {/* No services */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-xl border border-[#e0e3e5] bg-white px-6 py-12 text-center">

            <span className="material-symbols-outlined text-4xl text-[#76777d]">
              event_busy
            </span>

            <h3 className="mt-3 text-base font-semibold">
              No services available
            </h3>

            <p className="mt-1 text-sm text-[#76777d]">
              There are currently no services available for booking.
            </p>

          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={handleBack}
            className="flex h-12 items-center justify-center rounded-lg border border-[#c6c6cd] bg-white px-7 text-sm font-semibold text-[#191c1e] transition hover:bg-[#eceef0]"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!selectedService || !branchId || loading}
            onClick={handleContinue}
            className="flex h-12 items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white transition hover:bg-[#131b2e] disabled:cursor-not-allowed disabled:bg-[#e0e3e5] disabled:text-[#76777d]"
          >
            Continue to Schedule

            <span className="material-symbols-outlined ml-2 text-[18px]">
              arrow_forward
            </span>
          </button>

        </div>

      </div>

      {/* Mobile navigation */}
      <MobileBookingNavigation />

    </main>
  );
}

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
      active: true,
    },
    {
      number: 3,
      label: "Time",
      active: false,
    },
    {
      number: 4,
      label: "Done",
      active: false,
    },
  ];

  return (
    <div className="my-4 rounded-xl bg-white px-4 py-5 md:my-6 md:px-6">

      <div className="relative flex items-start justify-between">

        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-[#e0e3e5]" />

        <div className="absolute left-[12.5%] top-4 h-0.5 w-[25%] bg-black" />

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

      <div className="flex flex-col items-center justify-center rounded-full bg-[#6cf8bb] px-4 py-1 text-[#005236]">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          settings_suggest
        </span>

        <span className="mt-1 text-[10px] font-semibold">
          Services
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-2 text-[#76777d]">
        <span className="material-symbols-outlined">
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