export type DatabaseInfo = {
  id: number;
  type: string;
  database: string;
  server: string;
  username: string;
};

export type DataBaseResponse = {
  count: number;
  next: number | null;
  previous: number | null;
  results: Array<DatabaseInfo>;
};
