export interface InventoryHistory {
  algorithm?: {
    id: number;
    name: string;
  };
  id: number;
  date_created: string;
  date_updated: string;
  extra: Array<HistoryExtra>;
  photos: Array<HistoryPhoto>;
  start_tracking: string;
  stop_tracking: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  camera?: any;
}

export interface HistoryExtra {
  count: number;
  itemId: number;
  low_stock_level: number;
  status: string;
  image_item: string;
  isShow?: boolean;
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
  multi_row: string;
  id: number;
  name: string;
  status: string;
  current_stock_level: number;
  low_stock_level: number;
  camera: string;
  date_created: string;
  coords: any[];
  order_quantity: number | null;
  suppliers: number | null;
  to_emails: string[] | null;
  copy_emails: string[] | null;
  subject: string | null;
  object_type: string | null;
}

export interface Coordinat {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  id?: string;
}

export interface NewCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

export interface FourPointsNewCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
  id: string;
}

export interface DrawingCoordinates {
  x: number;
  y: number;
}

export interface Closing {
  status: boolean;
}
