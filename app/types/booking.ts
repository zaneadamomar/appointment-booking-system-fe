export interface Branch {
  branchId: string;
  branchName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  isActive: boolean;
}

export interface AppointmentType {
  serviceId: string;
  serviceName: string;
  description: string;
  durationMinutes: number;
}

export interface AvailableTimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  branchId: number;
  appointmentTypeId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "Confirmed" | "Completed" | "Cancelled";
}

export interface BookingRequest {
  bookingId?: string;
  userId: string;
  branchId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
}

export interface BookingResponse {
  bookingId: string;
  resultMessage: string;
  resultCode: number;
}

export interface UserBooking {
  bookingId: string;
  userId: string;
  userName: string;
  branchId: string;
  branchName: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  statusId: number;
  status: "Confirmed" | "Completed" | "Cancelled";
  createdDate: string;
}

export interface CancelBookingRequest {
  bookingId: string;
  userId: string;
}