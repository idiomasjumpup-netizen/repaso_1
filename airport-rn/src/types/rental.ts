export interface Customer {
  id: string;
  name: string;
  license_number: string;
  country: string;
  is_active: boolean;
  created_at?: string;
}

export interface InspectionReport {
  id: string;
  reservation_id: number;
  mileage_km: number;
  fuel_level: string;
  damages?: string;
  inspector_name?: string;
  created_at?: string;
}
