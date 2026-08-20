export interface Supplier {
  id: string;
  name: string;
  code: string;
  country: string;
  is_active: boolean;
  created_at?: string;
}

export interface BakingSheet {
  id: string;
  order_id: number;
  oven_batch: string;
  temperature_c: number;
  estimated_ready_at?: string;
  notes?: string;
  created_at?: string;
}
