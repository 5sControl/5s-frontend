import {
  FilterDataType,
  FilterDateDataType,
} from "./components/OrdersList/ordersListSlice";

export const getFilterQueryData = (
  searchParams: URLSearchParams
): FilterDataType => {
  const queryOrderStatusParam = searchParams.get("order-status");
  const queryOperationStatusParam = searchParams.getAll("operation-status");
  const queryOrderNameParam = searchParams.getAll("operation-name");

  const queryData = {
    "order-status": queryOrderStatusParam as string,
    "operation-status": queryOperationStatusParam,
    "operation-name": queryOrderNameParam,
  };
  return queryData;
};

export const getFilterDateQueryData = (
  searchParams: URLSearchParams
): FilterDateDataType => {
  const queryFromParam = searchParams.get("from") as string;
  const queryToParam = searchParams.get("to") as string;

  const queryDateParam: FilterDateDataType = {
    from: queryFromParam,
    to: queryToParam,
  };

  return queryDateParam;
};
