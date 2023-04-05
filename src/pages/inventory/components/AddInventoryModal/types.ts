import { Coordinat } from '../../types';
export interface AddInventoryData {
  coords?: Coordinat[];
  name?: string;
  low_stock_level?: number;
  camera?: string;
}
