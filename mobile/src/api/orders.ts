import axios from "axios";
import { getCookieValueByName } from "../utils/helpers";
import { ICompleteOrder, IOrderItemTimespan, IOrders, IReference, ITimespan } from "../models/interfaces/orders.interface";
import {
  IOrderOperation,
  IOrderOperationAddBody,
  IProductOperation,
  IProductOperationAddBody,
} from "../models/interfaces/operationItem.interface";
import { IItem, IItemAddBody, IOrderItemAddBody, IOrderItemUpdateBody, Item } from "../models/interfaces/item.interface";
import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;
const BASE = "api/erp-reference";

const URLS = {
  ORDERS: `/orders/`,

  OPERATIONS: `/operations/`,

  ITEMS: `/items/`,

  ORDER_ITEMS: `/order-items/`,

  ORDER_ITEM_OPERATIONS: `/order-operations/`,

  TIMESPANS: `/order-operation-timespans/`,
};

const axiosConfig = () => ({
  headers: {
    Authorization: getCookieValueByName("token"),
    "ngrok-skip-browser-warning": "true",
  },
});

const constructUrl = (endpoint: string) => `${BASE_URL}${BASE}${endpoint}`;

export const ORDERS_API = {
  getOrders: () => axios.get(constructUrl(URLS.ORDERS), axiosConfig()),
  addOrder: (body: IAddOrder) =>
    axios.post(constructUrl(URLS.ORDERS), body, axiosConfig()),
  getOrder: (id: number) =>
    axios.get<IOrders>(constructUrl(URLS.ORDERS + id + "/"), axiosConfig()),
  updateOrder: (id: number, body: any) =>
    axios.patch(constructUrl(URLS.ORDERS + id + "/"), body, axiosConfig()),
  completeOrder: (body: ICompleteOrder) =>
    axios.patch(constructUrl(URLS.ORDERS + "complete/"), body, axiosConfig()),

  addOrderItemOperation: (body: IOrderOperationAddBody) =>
    axios.post(constructUrl(URLS.ORDER_ITEM_OPERATIONS), {}, axiosConfig()),
  getOrderItemOperations: (orderItemId: number) =>
    axios.get<IOrderOperation[]>(constructUrl(URLS.ORDER_ITEM_OPERATIONS + "order-item/" + orderItemId + "/"), axiosConfig()),
  getOrderOperationById: (id: number) =>
    axios.get<IOrderOperation>(constructUrl(URLS.ORDER_ITEM_OPERATIONS + id + "/"), axiosConfig()),
  deleteOrderOperation: (id: number) =>
    axios.delete<IOrderOperation>(constructUrl(URLS.ORDER_ITEM_OPERATIONS + id + "/"), axiosConfig()),

  getOrderItemOperationsByName: (orderId: number, orderItemName: string) =>
    axios.get<any>(constructUrl(`/order-operations/order/${orderId}/order-item/${orderItemName}/`), axiosConfig()),
};

export const OPERATIONS_API = {
  addOperation: (body: IProductOperationAddBody) =>
    axios.post(constructUrl(URLS.OPERATIONS), body, axiosConfig()),
  getOperations: () =>
    axios.get<IProductOperation[]>(constructUrl(URLS.OPERATIONS), axiosConfig()),
  getOperationById: (id: number) =>
    axios.get<IProductOperation>(constructUrl(URLS.OPERATIONS + id + "/"), axiosConfig()),
  updateOperation: (id: number, body: IProductOperationAddBody) =>
    axios.patch(constructUrl(URLS.OPERATIONS + id + "/"), body, axiosConfig()),
};

export const ITEMS_API = {
  addItem: (body: IItemAddBody) =>
    axios.post(constructUrl(URLS.ITEMS), body, axiosConfig()),
  getItems: () =>
    axios.get<IItem[]>(constructUrl(URLS.ITEMS), axiosConfig()),
  getItemById: (id: number) =>
    axios.get<IItem>(constructUrl(URLS.ITEMS + id + "/"), axiosConfig()),
  updateItem: (id: number, body: IItemAddBody) =>
    axios.patch(constructUrl(URLS.ITEMS + id + "/"), body, axiosConfig()),
};

export const TIMESPAN_API = {
  addTimespan: (body: ITimespanAddBody) =>
    axios.post(constructUrl(URLS.TIMESPANS), body, axiosConfig()),
  updateTimespan: (id: number, body: ITimespanUpdateBody) =>
    axios.patch(constructUrl(URLS.TIMESPANS + id + "/"), body, axiosConfig()),
  getTimespan: (id: number) =>
    axios.get<ITimespan>(constructUrl(URLS.TIMESPANS + id + "/"), axiosConfig()),
  getOrderItemTimespans: (orderItemId: number) =>
    axios.get<any>(constructUrl(URLS.TIMESPANS + "order-item/" + orderItemId + "/"), axiosConfig()),
  getTimespansByEmployee: (employeeId: number) => 
    axios.get<ITimespan[]>(constructUrl(URLS.TIMESPANS + "employee/" + employeeId + "/"), axiosConfig())
};

export const ORDER_ITEMS_API = {
  addOrderItem: (body: IOrderItemAddBody) =>
    axios.post(constructUrl(URLS.ORDER_ITEMS), body, axiosConfig()),
  updateOrderItem: (id: number, body: IOrderItemUpdateBody) =>
    axios.patch(constructUrl(URLS.ORDER_ITEMS + id + "/"), body, axiosConfig()),
  getOrderItems: (orderId: number) =>
    axios.get<Item[]>(constructUrl(URLS.ORDER_ITEMS + "order/" + orderId + "/"), axiosConfig()),
  deleteOrderItem: (id: number) =>
    axios.delete(constructUrl(URLS.ORDER_ITEMS + id + "/"), axiosConfig()),
};

export interface ITimespanAddBody {
  orderId: number;
  orderOperationId: number;
  startedAt: string;
  finishedAt?: string;
}

export interface ITimespanUpdateBody {
  startedAt: string;
  finishedAt?: string;
}

export interface IOperationReferenceUpdateBody {
  referenceItemIds: number[];
}

export interface IAddOrder {
  orderNumber: number;
  name: string;
  estimatedAt?: string;
}