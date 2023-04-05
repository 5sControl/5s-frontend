import { HistoryExtra, InventoryItem } from './types';

export const getExtraOfActiveData = (
  extra: Array<HistoryExtra>,
  activeInventoryItem: InventoryItem | null
) => {
  const currentExtra = extra.find((item) => item.itemId === activeInventoryItem?.id);
  if (currentExtra) {
    return currentExtra;
  }

  return extra[0];
};
