import { http } from "./http";
import type { Airline } from "../types/airline";
import type { Paginated } from "../types/drf";

export type AirlineCreatePayload = {
  name: string;
  code?: string;
  country?: string;
  is_active: boolean;
  created_at?: string;
};

export async function listAirlinesApi(): Promise<Paginated<Airline> | Airline[]> {
  const { data } = await http.get<Paginated<Airline> | Airline[]>("/api/airlines/");
  return data;
}

export async function createAirlineApi(payload: AirlineCreatePayload): Promise<Airline> {
  const { data } = await http.post<Airline>("/api/airlines/", payload);
  return data;
}

export async function deleteAirlineApi(id: string): Promise<void> {
  await http.delete(`/api/airlines/${id}/`);
}