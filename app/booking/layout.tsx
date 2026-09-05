"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/layout/header";

const titles: Record<string, string> = {
  "/booking": "Branch Booking",
  "/booking/service": "Select a Service",
  "/booking/time": "Select a Time",
  "/booking/confirmation": "Confirm Booking",
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Booking";

  return (
    <>
      <Navbar mode="booking" title={title} />
      {children}
    </>
  );
}