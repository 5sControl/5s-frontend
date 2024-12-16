import { Coordinat } from "../../types";

export interface Camera {
  text: string;
  id: string;
}

export interface AddInventoryData {
  coords?: Coordinat[];
  name?: string;
  low_stock_level?: number;
  camera?: Camera;
}

export interface AddInventoryDataResponse {
  coords?: Coordinat[];
  name?: string;
  low_stock_level?: number;
  camera?: string;
}
