"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "../lib/api";
import { User } from "../types/user";

export default function LoginPage() {
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUsers() {
            try {
                setLoading(true);
                setError("");

                const data = await getUsers();

                setUsers(data);
            } catch (err) {
                console.error("Failed to load users:", err);
                setError("Unable to load users. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedUserId) {
            setError("Please select a user.");
            return;
        }

        const selectedUser = users.find(
            (user) => user.userId === selectedUserId
        );

        if (!selectedUser) {
            setError("Selected user could not be found.");
            return;
        }

        // Store the logged-in user for the rest of the booking flow
        sessionStorage.setItem(
            "currentUser",
            JSON.stringify(selectedUser)
        );

        router.push("/dashboard");
    };

    return (
        <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#e6e8ea] opacity-50 blur-[100px]" />

                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#dae2fd] opacity-30 blur-[120px]" />
            </div>

            <main className="w-full max-w-md z-10">

                {/* Logo */}
                <div className="text-center mb-8 flex flex-col items-center justify-center">

                    <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 hover:scale-105">
                        <span
                            className="material-symbols-outlined text-white"
                            style={{
                                fontSize: "32px",
                                fontVariationSettings: "'FILL' 1",
                            }}
                        >
                            shield
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-[32px] font-bold tracking-tight text-black">
                        Reliant
                    </h1>

                </div>

                {/* Login Card */}
                <div className="bg-white/85 backdrop-blur-[16px] border border-white/40 rounded-xl shadow-[0px_8px_24px_rgba(15,23,42,0.08)] p-4 md:p-8">

                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold mb-2">
                            Welcome Back
                        </h2>

                        <p className="text-sm text-[#45464d]">
                            Please sign in to access your secure account.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">

                        {/* User */}
                        <div className="space-y-2">

                            <label
                                htmlFor="user-select"
                                className="block text-xs font-medium text-[#45464d]"
                            >
                                Select User
                            </label>

                            <div className="relative">

                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span
                                        className="material-symbols-outlined text-[#76777d]"
                                        style={{ fontSize: "20px" }}
                                    >
                                        account_circle
                                    </span>
                                </div>

                                <select
                                    id="user-select"
                                    name="user"
                                    value={selectedUserId}
                                    onChange={(e) => {
                                        setSelectedUserId(e.target.value);
                                        setError("");
                                    }}
                                    disabled={loading}
                                    className="block w-full pl-10 pr-10 py-3 border border-[#c6c6cd] rounded-lg bg-white text-[#191c1e] text-sm transition-colors focus:outline-none focus:border-[#131b2e] cursor-pointer appearance-none disabled:opacity-60"
                                >
                                    <option value="">
                                        {loading
                                            ? "Loading users..."
                                            : "Select a user"}
                                    </option>

                                    {users.map((user) => (
                                        <option
                                            key={user.userId}
                                            value={user.userId}
                                        >
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>

                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#76777d]">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: "20px" }}
                                    >
                                        expand_more
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-lg bg-[#ffdad6] text-[#93000a] px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Sign In */}
                        <div className="pt-2">

                            <button
                                type="submit"
                                disabled={loading || !selectedUserId}
                                className="w-full flex items-center justify-center py-4 px-4 bg-[#131b2e] text-white hover:bg-black transition-colors duration-300 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <span className="text-base font-semibold mr-2">
                                    Sign In
                                </span>

                                <span
                                    className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200"
                                    style={{ fontSize: "20px" }}
                                >
                                    arrow_forward
                                </span>
                            </button>

                        </div>

                    </form>

                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-[#45464d]">
                        Need help?{" "}
                        <a
                            href="#"
                            className="text-black font-medium hover:underline"
                        >
                            Contact Support
                        </a>
                    </p>
                </div>

            </main>
        </main>
    );
}