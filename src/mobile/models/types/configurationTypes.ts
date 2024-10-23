export type DatabaseInfo = {
  id: number;
  type: string;
  database: string | null;
  server: string | null;
  username: string;
  erp_system: string;
  dbms: string;
  is_active: boolean;
  used_in_orders_view: boolean;
  host: string;
  password: string;
  port: number | null;
};

export type DataBaseResponse = {
  count: number;
  next: number | null;
  previous: number | null;
  results: Array<DatabaseInfo>;
};
