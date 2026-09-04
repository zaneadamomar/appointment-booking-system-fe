"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BranchSelector from "../components/booking/BranchSelector";
import type { Branch } from "../types/booking";
import { getBranches } from "../lib/api";

export default function BookingPage() {
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load branches from API
  useEffect(() => {
    async function loadBranches() {
      try {
        setLoading(true);
        setError("");

        const data = await getBranches();

        setBranches(data);
      } catch (err) {
        console.error("Failed to load branches:", err);
        setError("Unable to load branches. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadBranches();
  }, []);

  // Filter branches
  const filteredBranches = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return branches;
    }

    return branches.filter(
      (branch) =>
        branch.branchName.toLowerCase().includes(value) ||
        branch.city.toLowerCase().includes(value) ||
        branch.postalCode.toLowerCase().includes(value),
    );
  }, [search, branches]);

  // Continue to service selection
  const handleContinue = () => {
    if (!selectedBranch) {
      return;
    }

    router.push(`/booking/service?branchId=${selectedBranch.branchId}`);
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
              disabled={loading || !!error}
              className="h-14 w-full rounded-lg border border-[#c6c6cd] bg-white pl-12 pr-12 text-sm text-[#191c1e] outline-none transition placeholder:text-[#76777d] focus:border-black focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-[#f1f2f4]"
            />

            {search && !loading && (
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

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-[#e0e3e5] bg-white px-6 py-12 text-center">

            <span className="material-symbols-outlined animate-spin text-4xl text-[#76777d]">
              progress_activity
            </span>

            <h3 className="mt-3 text-base font-semibold">
              Loading branches...
            </h3>

            <p className="mt-1 text-sm text-[#76777d]">
              Please wait while we load the available branches.
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
              Unable to load branches
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

        {/* Branches */}
        {!loading && !error && (
          <BranchSelector
            branches={filteredBranches}
            selectedBranch={selectedBranch}
            onSelect={setSelectedBranch}
          />
        )}

        {/* No results */}
        {!loading && !error && filteredBranches.length === 0 && (
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
            disabled={!selectedBranch || loading || !!error}
            onClick={handleContinue}
            className="flex h-12 items-center justify-center rounded-lg bg-black px-7 text-sm font-semibold text-white transition hover:bg-[#131b2e] disabled:cursor-not-allowed disabled:bg-[#e0e3e5] disabled:text-[#76777d]"
          >
            Continue

          </button>

        </div>

      </div>

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

