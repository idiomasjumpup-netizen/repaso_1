import { http } from "./http";

export interface Product {
  id: number;
  name: string;
  category: string;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  product: number;
  product_name: string;
  product_category: string;
  customer_name: string;
  status: "RECEIVED" | "BAKING" | "READY" | "DELIVERED" | "CANCELLED";
  order_time: string;
  created_at: string;
}

export interface CreateOrderPayload {
  product: number;
  customer_name: string;
  status?: string;
  oven_batch?: string;
  temperature_c?: number;
  notes?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await http.get("/api/products/");
  return res.data.results || res.data;
};

export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  const res = await http.post("/api/products/", data);
  return res.data;
};

export const getOrders = async (status?: string): Promise<Order[]> => {
  const params = status ? { status } : {};
  const res = await http.get("/api/orders/", { params });
  return res.data.results || res.data;
};

export const createOrder = async (data: CreateOrderPayload): Promise<Order> => {
  const res = await http.post("/api/orders/", data);
  return res.data;
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<Order> => {
  const res = await http.patch(`/api/orders/${orderId}/`, { status });
  return res.data;
};
