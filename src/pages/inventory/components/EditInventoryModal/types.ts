import { Coordinat } from '../../types';
export interface Camera {
  text: string;
  id: string;
}
export interface EditInventoryData {
  name?: string;
  low_stock_level?: number;
  camera?: Camera;
  id?: number;
  coords?: Coordinat[];
}

export interface EditInventoryDataResponse {
  name?: string;
  low_stock_level?: number;
  camera?: string;
  id?: number;
  coords?: Coordinat[];
}