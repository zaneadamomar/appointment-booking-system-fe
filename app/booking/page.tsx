"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BranchSelector from "../components/booking/BranchSelector";
import type { Branch } from "../types/booking";

const branches: Branch[] = [
  {
    id: 1,
    name: "Durban Branch",
    address: "123 Smith Street",
    city: "Durban",
    postcode: "4001",
    open: true,
    distance: "0.8 km away",
  },
  {
    id: 2,
    name: "Umhlanga Branch",
    address: "10 Lagoon Drive",
    city: "Umhlanga",
    postcode: "4319",
    open: true,
    distance: "12.4 km away",
  },
  {
    id: 3,
    name: "Pietermaritzburg Branch",
    address: "45 Church Street",
    city: "Pietermaritzburg",
    postcode: "3201",
    open: true,
    distance: "78.2 km away",
  },
  {
    id: 4,
    name: "Westville Branch",
    address: "1 Jan Hofmeyr Road",
    city: "Westville",
    postcode: "3629",
    open: false,
    distance: "8.5 km away",
  },
];

export default function BookingPage() {
  const router = useRouter();

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [search, setSearch] = useState("");

  const filteredBranches = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return branches;
    }

    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(value) ||
        branch.city.toLowerCase().includes(value) ||
        branch.postcode.toLowerCase().includes(value),
    );
  }, [search]);

const handleContinue = () => {
  if (!selectedBranch) {
    return;
  }

  router.push(`/booking/service?branchId=${selectedBranch.id}`);
};
  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e0e3e5] bg-white">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4 md:px-6">
          <button
            type="button"
            onClick={() => router.back()}
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

      <div className="mx-auto w-full max-w-5xl px-4 pb-28 md:px-6 md:pb-10">

        {/* Progress */}
        <BookingProgress />

        {/* Page heading */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
            Select a Branch
          </h2>

          <p className="mt-2 text-sm text-[#45464d]">
            Choose a location to continue your booking.
          </p>
        </section>

        {/* Search */}
        <section className="mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#76777d]">
              search
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by branch, city or postcode"
              className="h-14 w-full rounded-lg border border-[#c6c6cd] bg-white pl-12 pr-12 text-sm text-[#191c1e] outline-none transition placeholder:text-[#76777d] focus:border-black focus:ring-1 focus:ring-black"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-black"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Branches */}
        <BranchSelector
          branches={filteredBranches}
          selectedBranch={selectedBranch}
          onSelect={setSelectedBranch}
        />

        {/* No results */}
        {filteredBranches.length === 0 && (
          <div className="rounded-xl border border-[#e0e3e5] bg-white px-6 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-[#76777d]">
              location_off
            </span>

            <h3 className="mt-3 text-base font-semibold">
              No branches found
            </h3>

            <p className="mt-1 text-sm text-[#76777d]">
              Try searching for another branch or city.
            </p>
          </div>
        )}

        {/* Continue */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled={!selectedBranch}
            onClick={handleContinue}
            className="flex h-12 items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white transition hover:bg-[#131b2e] disabled:cursor-not-allowed disabled:bg-[#e0e3e5] disabled:text-[#76777d]"
          >
            Continue

            <span className="material-symbols-outlined ml-2 text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>

      </div>

      {/* Mobile bottom navigation */}
      <MobileBookingNavigation />
    </main>
  );
}

function BookingProgress() {
  const steps = [
    { number: 1, label: "Branch" },
    { number: 2, label: "Service" },
    { number: 3, label: "Time" },
    { number: 4, label: "Done" },
  ];

  return (
    <div className="my-4 rounded-xl bg-white px-4 py-5 shadow-[0px_4px_12px_rgba(15,23,42,0.05)] md:my-6 md:px-6">
      <div className="relative flex items-start justify-between">

        {/* Background line */}
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-[#e0e3e5]" />

        {/* Progress line */}
        <div className="absolute left-[12.5%] top-4 h-0.5 w-[12.5%] bg-black" />

        {steps.map((step) => {
          const active = step.number === 1;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? "bg-black text-white"
                    : "bg-[#e0e3e5] text-[#45464d]"
                }`}
              >
                {step.number}
              </div>

              <span
                className={`mt-2 text-[10px] font-semibold tracking-wide ${
                  active ? "text-black" : "text-[#76777d]"
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

function MobileBookingNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-[#e0e3e5] bg-white px-4 shadow-[0px_-4px_12px_rgba(15,23,42,0.05)] md:hidden">

      <div className="flex flex-col items-center justify-center rounded-full bg-[#6cf8bb] px-4 py-1 text-[#005236]">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
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