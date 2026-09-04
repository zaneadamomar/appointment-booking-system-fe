"use client";

import type { Branch } from "../../types/booking";

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelect: (branch: Branch) => void;
}

export default function BranchSelector({
  branches,
  selectedBranch,
  onSelect,
}: BranchSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {branches.map((branch) => {
        const selected = selectedBranch?.id === branch.id;

        return (
          <button
            key={branch.id}
            type="button"
            disabled={!branch.open}
            onClick={() => onSelect(branch)}
            className={`flex min-h-[170px] flex-col justify-between rounded-xl border bg-white p-5 text-left shadow-[0px_4px_12px_rgba(15,23,42,0.05)] transition ${
              selected
                ? "border-2 border-black shadow-md"
                : "border-[#e0e3e5] hover:border-[#76777d] hover:shadow-md"
            } ${
              !branch.open
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer"
            }`}
          >
            <div className="w-full">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h3 className="text-base font-semibold text-black">
                    {branch.name}
                  </h3>

                  <p className="mt-2 flex items-start gap-1 text-sm text-[#45464d]">
                    <span className="material-symbols-outlined mt-[1px] text-[16px]">
                      location_on
                    </span>

                    <span>
                      {branch.address}
                      <br />
                      {branch.city}, {branch.postcode}
                    </span>
                  </p>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold ${
                    branch.open
                      ? "bg-[#006c49]/10 text-[#006c49]"
                      : "bg-[#e0e3e5] text-[#45464d]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      branch.open
                        ? "bg-[#006c49]"
                        : "bg-[#76777d]"
                    }`}
                  />

                  {branch.open ? "Open" : "Closed"}
                </span>

              </div>

            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#e0e3e5] pt-4">

              <span className="text-xs text-[#76777d]">
                {branch.distance}
              </span>

              {selected ? (
                <span className="flex h-10 items-center gap-2 rounded-lg bg-black px-5 text-xs font-semibold text-white">
                  <span className="material-symbols-outlined text-[17px]">
                    check
                  </span>

                  Selected
                </span>
              ) : (
                <span
                  className={`flex h-10 items-center rounded-lg px-5 text-xs font-semibold ${
                    branch.open
                      ? "bg-black text-white"
                      : "bg-[#e0e3e5] text-[#76777d]"
                  }`}
                >
                  Select
                </span>
              )}

            </div>
          </button>
        );
      })}
    </div>
  );
}