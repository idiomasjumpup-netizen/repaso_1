import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Flight } from "../types/flight";

export async function listFlightsApi(): Promise<Paginated<Flight> | Flight[]> {
  const { data } = await http.get<Paginated<Flight> | Flight[]>("/api/flights/");
  return data;
}