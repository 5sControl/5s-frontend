export interface ConnectionItem {
  id: number;
  erp_system: string;
  is_active: boolean;
  used_in_orders_view: boolean;
  host: string;
  read_only: boolean;
}
