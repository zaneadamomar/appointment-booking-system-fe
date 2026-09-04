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

    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

    return (
        <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">

            {/* Navbar */}
            <nav className="bg-white border-b border-[#e5e7eb]">

                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <span
                                className="material-symbols-outlined text-white"
                                style={{
                                    fontSize: "22px",
                                    fontVariationSettings: "'FILL' 1",
                                }}
                            >
                                shield
                            </span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg text-black">
                                Reliant
                            </h1>

                            <p className="text-xs text-[#76777d]">
                                Appointment System
                            </p>
                        </div>

                    </div>

                    {/* User */}
                    <div className="flex items-center gap-4">

                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold">
                                {user.firstName} {user.lastName}
                            </p>

                            <p className="text-xs text-[#76777d]">
                                {user.email}
                            </p>
                        </div>

                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#131b2e] text-white flex items-center justify-center">
                            <span className="text-sm font-semibold">
                                {initials}
                            </span>
                        </div>

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center justify-center w-10 h-10 rounded-lg text-[#45464d] hover:bg-[#f1f2f4] hover:text-black transition-colors"
                            title="Logout"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: "22px" }}
                            >
                                logout
                            </span>
                        </button>

                    </div>

                </div>

            </nav>

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
                    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">

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

                    </div>

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