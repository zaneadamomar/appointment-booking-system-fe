"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../../types/user";

interface NavbarProps {
  mode?: "dashboard" | "booking";
  title?: string;
  onBack?: () => void;
}

export default function Navbar({ mode = "dashboard", title, onBack }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    router.push("/login");
  };

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "";

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-auto md:py-4 flex items-center justify-between">

        {/* Left side */}
        <div className="flex items-center gap-3">
          {mode === "booking" ? (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="mr-1 rounded-full p-2 text-[#45464d] transition hover:bg-[#eceef0]"
                aria-label="Go back"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>

              <h1 className="text-base font-bold tracking-tight text-black">
                {title}
              </h1>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}
                >
                  shield
                </span>
              </div>

              <div>
                <h1 className="font-bold text-lg text-black">Reliant</h1>
                <p className="text-xs text-[#76777d]">Appointment System</p>
              </div>
            </>
          )}
        </div>

        {/* Right side — always shown when we have a user */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[#76777d]">{user.email}</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#131b2e] text-white flex items-center justify-center">
              <span className="text-sm font-semibold">{initials}</span>
            </div>

            {mode === "dashboard" && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-[#45464d] hover:bg-[#f1f2f4] hover:text-black transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                  logout
                </span>
              </button>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}