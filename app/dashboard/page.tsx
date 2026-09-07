"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/user";

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("currentUser");

        if (!storedUser) {
            router.replace("/login");
            return;
        }

        try {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Invalid stored user:", error);

            sessionStorage.removeItem("currentUser");
            router.replace("/login");
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem("currentUser");
        router.push("/login");
    };

    // Don't render the dashboard until we've checked the session
    if (!user) {
        return (
            <main className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
                <div className="text-sm text-[#45464d]">
                    Loading...
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">

            {/* Dashboard */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}
                <div className="mb-8">

                    <h2 className="text-2xl md:text-3xl font-bold">
                        Welcome back, {user.firstName}
                    </h2>

                    <p className="text-[#76777d] mt-2">
                        Manage your appointments and bookings.
                    </p>

                </div>

                {/* Dashboard content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Book Appointment */}
                    <button
                        onClick={() => router.push("/booking")}
                        className="text-left bg-white rounded-xl border border-[#e5e7eb] p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 rounded-lg bg-[#131b2e] text-white flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined">
                                calendar_month
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            Book an Appointment
                        </h3>

                        <p className="text-sm text-[#76777d]">
                            Schedule a new appointment at one of our branches.
                        </p>
                    </button>

                    {/* My Appointments */}
                      <button
                        onClick={() => router.push("/mybookings")}
                        className="text-left bg-white rounded-xl border border-[#e5e7eb] p-6 hover:shadow-md transition-shadow"
                    >
                    

                        <div className="w-12 h-12 rounded-lg bg-[#eef1f5] flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined text-[#131b2e]">
                                event
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            My Appointments
                        </h3>

                        <p className="text-sm text-[#76777d]">
                            View and manage your upcoming appointments.
                        </p>

                  
                    </button>

                    {/* Account */}
                    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">

                        <div className="w-12 h-12 rounded-lg bg-[#eef1f5] flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined text-[#131b2e]">
                                account_circle
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            My Account
                        </h3>

                        <p className="text-sm text-[#76777d]">
                            {user.firstName} {user.lastName}
                        </p>

                        <p className="text-sm text-[#76777d] mt-1">
                            {user.email}
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}