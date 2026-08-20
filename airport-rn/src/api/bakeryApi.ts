import { API_BASE_URL } from "../config";
import { Supplier, BakingSheet } from "../types/bakery";

export async function fetchSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${API_BASE_URL}/api/suppliers/`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: No se pudo obtener la lista de proveedores.`);
  }
  return res.json();
}

export async function createSupplier(data: { name: string; code: string; country: string }): Promise<Supplier> {
  const res = await fetch(`${API_BASE_URL}/api/suppliers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}: No se pudo crear el proveedor.`);
  }
  return res.json();
}

export async function fetchBakingSheets(orderId?: number): Promise<BakingSheet[]> {
  const url = orderId
    ? `${API_BASE_URL}/api/baking-sheets/?order_id=${orderId}`
    : `${API_BASE_URL}/api/baking-sheets/`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: No se pudo obtener las hojas de horneado.`);
  }
  return res.json();
}
