import { API_BASE_URL } from "../config";
import { Customer, InspectionReport } from "../types/rental";

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE_URL}/api/customers/`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: No se pudo obtener la lista de clientes.`);
  }
  return res.json();
}

export async function createCustomer(data: {
  name: string;
  license_number: string;
  country: string;
}): Promise<Customer> {
  const res = await fetch(`${API_BASE_URL}/api/customers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}: No se pudo registrar el cliente.`);
  }
  return res.json();
}

export async function fetchInspectionReports(reservationId?: number): Promise<InspectionReport[]> {
  const url = reservationId
    ? `${API_BASE_URL}/api/inspection-reports/?reservation_id=${reservationId}`
    : `${API_BASE_URL}/api/inspection-reports/`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: No se pudo obtener las actas de inspección.`);
  }
  return res.json();
}
