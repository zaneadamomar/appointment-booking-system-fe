import { User } from "../types/user";
import type { Branch, AppointmentType, AvailableTimeSlot, CreateBookingRequest, BookingResponse, UserBooking, CancelBookingRequest } from "../types/booking";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/api/GetUsers`, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve users. Status: ${response.status}`);
  }

  return response.json();
}

export async function getBranches(): Promise<Branch[]> {
  const response = await fetch(`${API_URL}/api/GetBranch`, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve branches. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function getServices(): Promise<AppointmentType[]> {
  const response = await fetch(`${API_URL}/api/GetService`, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve services. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function getAvailableTimeSlots(
  branchId: string,
  serviceId: string,
  bookingDate: string,
): Promise<AvailableTimeSlot[]> {
  const response = await fetch(
    `${API_URL}/api/GetAvailableTimeSlots?BranchId=${encodeURIComponent(
      branchId,
    )}&ServiceId=${encodeURIComponent(
      serviceId,
    )}&BookingDate=${encodeURIComponent(bookingDate)}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve available time slots. Status: ${response.status}`,
    );
  }

  return response.json();
}

export async function createBooking(
  booking: CreateBookingRequest
): Promise<BookingResponse> {
  const response = await fetch(`${API_URL}/api/CreateBooking`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create booking. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function getUserBookings(userId: string): Promise<UserBooking[]> {
  const response = await fetch(
    `${API_URL}/api/GetUserBooking?UserId=${userId}`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load bookings. Status: ${response.status}`);
  }

  return response.json();
}

export async function cancelBooking(request: CancelBookingRequest): Promise<BookingResponse> {
  const response = await fetch(`${API_URL}/api/CancelBooking`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel booking. Status: ${response.status}`);
  }

  return response.json();
}