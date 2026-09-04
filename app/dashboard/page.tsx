import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b border-gray-200 bg-white px-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Branch Booking
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-gray-100">
            🔔
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            Z
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Welcome */}
        <section className="mb-8">
          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Good afternoon, Zane
          </h2>

          <p className="mt-2 text-gray-600">
            Manage your branch appointments and upcoming bookings.
          </p>
        </section>

        {/* Book Appointment */}
        <section className="mb-8 overflow-hidden rounded-xl bg-[#131b2e] p-8 text-white shadow-lg">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            <div>
              <h2 className="text-xl font-semibold">
                Schedule an Appointment
              </h2>

              <p className="mt-2 max-w-lg text-sm text-gray-300">
                Choose a branch, appointment type, date and available
                time to make your booking.
              </p>
            </div>

            <Link
              href="/booking"
              className="rounded-lg bg-[#6ffbbe] px-6 py-3 text-sm font-semibold text-[#002113] transition hover:bg-[#4edea3]"
            >
              Book Appointment
            </Link>

          </div>
        </section>

        {/* Upcoming Appointment */}
        <section className="mb-8">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Appointment
            </h2>

            <Link
              href="/bookings"
              className="text-sm font-medium text-[#006c49] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  📅
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Account Consultation
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Durban Branch
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    15 September 2026 · 10:30 - 11:00
                  </p>
                </div>

              </div>

              <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Confirmed
              </span>

            </div>

          </div>

        </section>

        {/* Recent Bookings */}
        <section>

          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Bookings
          </h2>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="divide-y divide-gray-100">

              <BookingRow
                appointment="Account Consultation"
                branch="Durban Branch"
                date="15 September 2026"
                status="Confirmed"
              />

              <BookingRow
                appointment="Mortgage Consultation"
                branch="Umhlanga Branch"
                date="20 September 2026"
                status="Confirmed"
              />

              <BookingRow
                appointment="Financial Planning"
                branch="Pietermaritzburg Branch"
                date="28 August 2026"
                status="Completed"
              />

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

interface BookingRowProps {
  appointment: string;
  branch: string;
  date: string;
  status: string;
}

function BookingRow({
  appointment,
  branch,
  date,
  status,
}: BookingRowProps) {
  return (
    <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">

      <div>
        <p className="font-medium text-gray-900">
          {appointment}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {branch} · {date}
        </p>
      </div>

      <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        {status}
      </span>

    </div>
  );
}