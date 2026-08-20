import { http } from "./http";

export interface Vehicle {
  id: number;
  plate: string;
  type: string;
  is_available: boolean;
  created_at: string;
}

export interface Reservation {
  id: number;
  vehicle: number;
  vehicle_plate: string;
  vehicle_type: string;
  renter_name: string;
  status: "RESERVED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED" | "CANCELLED";
  pickup_time: string;
  created_at: string;
}

export interface CreateReservationPayload {
  vehicle: number;
  renter_name: string;
  status?: string;
  mileage_km?: number;
  fuel_level?: string;
  damages?: string;
  inspector_name?: string;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  const res = await http.get("/api/vehicles/");
  return res.data.results || res.data;
};

export const createVehicle = async (data: Partial<Vehicle>): Promise<Vehicle> => {
  const res = await http.post("/api/vehicles/", data);
  return res.data;
};

export const getReservations = async (status?: string): Promise<Reservation[]> => {
  const params = status ? { status } : {};
  const res = await http.get("/api/reservations/", { params });
  return res.data.results || res.data;
};

export const createReservation = async (data: CreateReservationPayload): Promise<Reservation> => {
  const res = await http.post("/api/reservations/", data);
  return res.data;
};

export const updateReservationStatus = async (
  reservationId: number,
  status: string
): Promise<Reservation> => {
  const res = await http.patch(`/api/reservations/${reservationId}/`, { status });
  return res.data;
};
