import { HistoryExtra, InventoryItem } from './types';

export const getExtraOfActiveData = (
  extra: Array<HistoryExtra>,
  activeInventoryItem: InventoryItem | null
): HistoryExtra => {
  let currentExtra: HistoryExtra | undefined = extra.find(
    (item) => item.itemId === (activeInventoryItem?.id ?? 0)
  );
  currentExtra = currentExtra && { ...currentExtra, isShow: true };
  return (
    currentExtra || {
      count: 0,
      itemId: 0,
      low_stock_level: 0,
      status: '',
      image_item: '',
      isShow: false,
    }
  );
};
