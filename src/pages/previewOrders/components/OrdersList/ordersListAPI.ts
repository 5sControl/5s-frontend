import axios from "axios";
import { proxy } from "../../../../api/api";
import { OrderWithPaginationCustomer } from "../../../../storage/orderViewCustomer";
import { FilterDataParams } from "./ordersListSlice";

export const getOrdersAPI = (
  hostname: string,
  cookies: string,
  page: number,
  page_size: number,
  search: string | null,
  params: FilterDataParams
) => {
  const API_ALL_ORDERS = "api/order/all-orders/";

  return false;
};
