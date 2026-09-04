export interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  postcode: string;
  open: boolean;
  distance: string;
}

export interface AppointmentType {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
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