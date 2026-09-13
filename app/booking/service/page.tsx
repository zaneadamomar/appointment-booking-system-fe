"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingProgress from "../../components/bookingprogress";
import AppointmentSelector from "../../components/booking/AppointmentSelector";
import type { AppointmentType } from "../../types/booking";
import { getServices } from "../../lib/api";

function SelectServicePage() {
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
      <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-4 md:px-6 md:pb-10">

        {/* Progress */}
        <BookingProgress currentStep={2} />

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
    </main>
  );
}

export default function ServicePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4">
          <div className="w-full max-w-md rounded-xl border border-[#e0e3e5] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f8f1]">
              <span className="material-symbols-outlined animate-spin text-[32px] text-[#006c49]">
                progress_activity
              </span>
            </div>

            <h1 className="mt-6 text-xl font-semibold text-black">
              Loading services...
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#76777d]">
              Please wait while we load the available services.
            </p>
          </div>
        </main>
      }
    >
      <SelectServicePage />
    </Suspense>
  );
}
