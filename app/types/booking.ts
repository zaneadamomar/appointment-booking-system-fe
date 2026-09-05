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

export interface CreateBookingRequest {
    userId: string;
    branchId: string;
    serviceId: string;
    bookingDate: string;
    startTime: string;
}

export interface CreateBookingResponse {
    bookingId: string;
    resultMessage: string;
    resultCode: number;
}