"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserBooking } from "../types/booking";
import { getUserBookings, cancelBooking } from "../lib/api";

type TabKey = "upcoming" | "past";

export default function MyBookingsPage() {
    const router = useRouter();

    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [cancelError, setCancelError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("currentUser");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = currentUser?.userId;

        if (!userId) {
            setError("You must be signed in to view your bookings.");
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        const loadBookings = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getUserBookings(userId);

                if (!cancelled) {
                    setBookings(data);
                }
            } catch (err) {
                console.error("Failed to load bookings:", err);
                if (!cancelled) {
                    setError("Unable to load your bookings. Please try again.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadBookings();

        return () => {
            cancelled = true;
        };
    }, []);

    // ...rest stays exactly as before (useMemo for upcoming/past, handleCancelBooking, JSX)

    const { upcoming, past } = useMemo(() => {
        const now = new Date();

        const upcomingList: UserBooking[] = [];
        const pastList: UserBooking[] = [];

        for (const booking of bookings) {
            const endsAt = getBookingEndDateTime(booking);
            const isCancelled = booking.statusId === 3;
            const isCompleted = booking.statusId === 2;

            if (!isCancelled && !isCompleted && endsAt >= now) {
                upcomingList.push(booking);
            } else {
                pastList.push(booking);
            }
        }

        upcomingList.sort(
            (a, b) =>
                getBookingStartDateTime(a).getTime() -
                getBookingStartDateTime(b).getTime()
        );

        pastList.sort(
            (a, b) =>
                getBookingStartDateTime(b).getTime() -
                getBookingStartDateTime(a).getTime()
        );

        return { upcoming: upcomingList, past: pastList };
    }, [bookings]);

    const handleCancelBooking = async (bookingId: string) => {
        const storedUser = sessionStorage.getItem("currentUser");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = currentUser?.userId;

        if (!userId) {
            setCancelError("You must be signed in to cancel a booking.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );
        if (!confirmed) {
            return;
        }

        try {
            setCancellingId(bookingId);
            setCancelError(null);

            const result = await cancelBooking({ bookingId, userId });

            if (result.resultCode !== 0) {
                throw new Error(result.resultMessage || "Unable to cancel booking.");
            }

            // Update locally instead of refetching — flip status to Cancelled
            setBookings((prev) =>
                prev.map((b) =>
                    b.bookingId === bookingId
                        ? { ...b, status: "Cancelled", statusId: 3 }
                        : b
                )
            );
        } catch (err) {
            console.error("Cancel booking error:", err);
            setCancelError(
                err instanceof Error ? err.message : "Unable to cancel booking."
            );
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
            <header className="sticky top-0 z-10 border-b border-[#e0e3e5] bg-white/80 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-3xl items-center gap-2 px-4">
                    <button
                        type="button"
                        aria-label="Go back"
                        onClick={() => router.back()}
                        className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#eceef0]"
                    >
                        <span className="material-symbols-outlined text-[24px]">
                            arrow_back
                        </span>
                    </button>
                    <h1 className="text-xl font-semibold tracking-tight">
                        My Bookings
                    </h1>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
                {/* Tabs */}
                <div className="flex w-full items-center rounded-xl bg-[#e6e8ea] p-1 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setActiveTab("upcoming")}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${activeTab === "upcoming"
                            ? "bg-white text-[#191c1e] shadow-sm"
                            : "text-[#45464d] hover:text-[#191c1e]"
                            }`}
                    >
                        Upcoming
                        <span className="rounded-full bg-[#006c49] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {upcoming.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("past")}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${activeTab === "past"
                            ? "bg-white text-[#191c1e] shadow-sm"
                            : "text-[#45464d] hover:text-[#191c1e]"
                            }`}
                    >
                        Past
                        <span className="rounded-full bg-[#e0e3e5] px-1.5 py-0.5 text-[10px] font-semibold text-[#45464d]">
                            {past.length}
                        </span>
                    </button>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center rounded-xl border border-[#e0e3e5] bg-white py-16">
                        <div className="flex items-center gap-3 text-sm text-[#76777d]">
                            <span className="material-symbols-outlined animate-spin text-[#006c49]">
                                progress_activity
                            </span>
                            Loading your bookings...
                        </div>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {cancelError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {cancelError}
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {activeTab === "upcoming" ? (
                            upcoming.length === 0 ? (
                                <EmptyState
                                    icon="event_busy"
                                    title="No upcoming appointments"
                                    description="You don't have any upcoming bookings right now."
                                />
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {upcoming.map((booking) => (
                                        <BookingCard
                                            key={booking.bookingId}
                                            booking={booking}
                                            highlighted={isTomorrowOrToday(booking)}
                                            onCancel={() => handleCancelBooking(booking.bookingId)}
                                            onReschedule={() =>
                                                router.push(
                                                    `/booking/time?branchId=${booking.branchId}&serviceId=${booking.serviceId}&rescheduleBookingId=${booking.bookingId}`
                                                )
                                            }
                                            isCancelling={cancellingId === booking.bookingId}
                                        />
                                    ))}
                                </div>
                            )
                        ) : past.length === 0 ? (
                            <EmptyState
                                icon="history"
                                title="No past appointments"
                                description="Your completed and cancelled bookings will show up here."
                            />
                        ) : (
                            <div className="flex flex-col gap-3">
                                {past.map((booking) => (
                                    <PastBookingCard key={booking.bookingId} booking={booking} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Book new appointment */}
                <div className="mt-2 flex flex-col gap-3 rounded-xl bg-black p-6 text-white">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d3133]">
                            <span className="material-symbols-outlined text-[22px] text-[#6cf8bb]">
                                support_agent
                            </span>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">
                                Need another appointment?
                            </h3>
                            <p className="mt-0.5 text-sm text-[#c6c6cd]">
                                Explore services across our branches and book your next visit.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/booking")}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#006c49] text-sm font-semibold text-white shadow-sm transition hover:bg-[#005236]"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            calendar_add_on
                        </span>
                        Book New Appointment
                    </button>
                </div>
            </div>
        </main>
    );
}

interface BookingCardProps {
    booking: UserBooking;
    highlighted: boolean;
    onCancel: () => void;
    onReschedule: () => void;
    isCancelling: boolean;
}


function BookingCard({ booking, highlighted, onCancel, onReschedule, isCancelling }: BookingCardProps) {
    return (
        <div
            className={`relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#e0e3e5] bg-white p-4 shadow-sm ${highlighted ? "shadow-md" : ""
                }`}
        >
            {highlighted && (
                <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-[#006c49]" />
            )}

            <div className={`flex items-center gap-2 ${highlighted ? "pl-1" : ""}`}>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8f1] px-2.5 py-1 text-xs font-semibold text-[#006c49]">
                    <span
                        className="material-symbols-outlined text-[15px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        check_circle
                    </span>
                    {booking.status}
                </span>
                <span className="text-xs text-[#76777d]">
                    Ref: #{booking.bookingId}
                </span>
            </div>

            <div className={`flex items-start gap-3 ${highlighted ? "pl-1" : ""}`}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#131b2e]">
                    <span className="material-symbols-outlined text-[24px] text-[#dae2fd]">
                        event_available
                    </span>
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold">
                        {booking.serviceName}
                    </h2>
                    <p className="text-sm text-[#45464d]">{booking.branchName}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 rounded-lg bg-[#f7f9fb] p-3">
                <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-[#006c49]">
                        schedule
                    </span>
                    <div className="min-w-0">
                        <span className="block text-sm font-semibold">
                            {formatBookingDate(booking)}
                        </span>
                        <span className="text-sm text-[#76777d]">
                            {formatTimeRange(booking)}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                    <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#76777d]">
                        location_on
                    </span>
                    <span className="truncate text-sm font-semibold">
                        {booking.branchName}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onReschedule}
                        className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#eceef0] px-3 text-sm font-semibold transition hover:bg-[#e0e3e5]"
                    >
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        Reschedule
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"

                    >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        Cancel Appointment
                    </button>
                </div>
            </div>
        </div>
    );
}

function PastBookingCard({ booking }: { booking: UserBooking }) {
    const styles = getStatusStyles(booking);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[#e0e3e5] bg-white p-4 opacity-90 shadow-sm">
            <div className="flex items-center justify-between">
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles.bg} ${styles.text}`}
                >
                    {booking.status}
                </span>
                <span className="text-xs text-[#76777d]">
                    {getBookingStartDateTime(booking).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f2f4f6]">
                    <span
                        className={`material-symbols-outlined text-[22px] ${styles.text}`}
                    >
                        {styles.icon}
                    </span>
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{booking.serviceName}</h3>
                    <p className="text-sm text-[#76777d]">{booking.branchName}</p>
                </div>
            </div>
        </div>
    );
}

function EmptyState({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center rounded-xl border border-[#e0e3e5] bg-white px-6 py-14 text-center">
            <span className="material-symbols-outlined text-4xl text-[#76777d]">
                {icon}
            </span>
            <h3 className="mt-3 text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-[#76777d]">{description}</p>
        </div>
    );
}

function combineDateAndTime(bookingDate: string, time: string) {
    const datePart = bookingDate.split("T")[0];
    return new Date(`${datePart}T${time}`);
}

function getBookingStartDateTime(booking: UserBooking) {
    return combineDateAndTime(booking.bookingDate, booking.startTime);
}

function getBookingEndDateTime(booking: UserBooking) {
    return combineDateAndTime(booking.bookingDate, booking.endTime);
}

function isTomorrowOrToday(booking: UserBooking) {
    const date = getBookingStartDateTime(booking);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return (
        compareDate.getTime() === today.getTime() ||
        compareDate.getTime() === tomorrow.getTime()
    );
}

function formatBookingDate(booking: UserBooking) {
    const date = getBookingStartDateTime(booking);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const fullDate = date.toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    if (compareDate.getTime() === today.getTime()) {
        return `Today, ${fullDate}`;
    }

    if (compareDate.getTime() === tomorrow.getTime()) {
        return `Tomorrow, ${fullDate}`;
    }

    return date.toLocaleDateString("en-ZA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatTime(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatTimeRange(booking: UserBooking) {
    return `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)} (${booking.durationMinutes} mins)`;
}


function getStatusStyles(booking: UserBooking) {
    switch (booking.status) {
        case "Confirmed":
            return { bg: "bg-[#e8f8f1]", text: "text-[#006c49]", icon: "check_circle" };
        case "Completed":
            return { bg: "bg-[#eceef0]", text: "text-[#45464d]", icon: "task_alt" };
        case "Cancelled":
            return { bg: "bg-[#feecec]", text: "text-[#b42318]", icon: "cancel" };
        default:
            return { bg: "bg-[#eceef0]", text: "text-[#45464d]", icon: "info" };
    }
}