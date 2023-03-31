export interface InventoryHistory {
  id: number;
  date_created: string;
  date_updated: string;
  extra: Array<HistoryExtra>;
  photos: Array<HistoryPhoto>;
  start_tracking: string;
  stop_tracking: string;
}

export interface HistoryExtra {
  count: number;
  itemId: number;
  low_stock_level: number;
  status: string;
}

export interface HistoryPhoto {
  id: number;
  image: string;
  report_id: number;
  date: string;
}

export interface Camera {
  description: string | null;
  id: string;
  is_active: boolean;
  name: string;
  password: string;
  username: string;
}

export type InventoryItemDataBaseResponse = {
  count: number;
  next: number | null;
  previous: number | null;
  results: Array<InventoryItem>;
};

export interface InventoryItem {
  id: number;
  name: string;
  status: string;
  current_stock_level: number;
  low_stock_level: number;
  camera: string;
  date_created: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coords: any;
}
