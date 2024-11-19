import axios from "axios";
import { getCookieValueByName } from "../utils/helpers";
import { IOrders, IReference, ITimespan } from "../models/interfaces/orders.interface";
import {
  IOrderOperation,
  IOrderOperationAddBody,
  IProductOperation,
  IProductOperationAddBody,
} from "../models/interfaces/operationItem.interface";
import { IItem, IItemAddBody, IOrderItemAddBody, IOrderItemUpdateBody, Item } from "../models/interfaces/item.interface";

const BASE = "api/erp-reference";
const URLS = {
  ORDERS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/orders/`,

  OPERATIONS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/operations/`,

  ITEMS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/items/`,

  ORDER_ITEMS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-items/`,

  ORDER_ITEM_OPERATIONS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-operations/`,

  TIMESPANS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-operation-timespans/`,
};

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

request.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getCookieValueByName("token");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const ORDERS_API = {
  getOrders: () => request.get(URLS.ORDERS),
  addOrder: (body: IAddOrder) =>
    request.post(URLS.ORDERS, body),
  getOrder: (id: number) =>
    request.get<IOrders>(URLS.ORDERS + id + "/"),
  updateOrder: (id: number, body: any) =>
    request.patch(URLS.ORDERS + id + "/", body),

  addOrderItemOperation: (body: IOrderOperationAddBody) =>
    request.post(URLS.ORDER_ITEM_OPERATIONS, {}),
  getOrderItemOperations: (orderItemId: number) =>
    request.get<IOrderOperation[]>(URLS.ORDER_ITEM_OPERATIONS + "order-item/"+ orderItemId + "/"),
  getOrderOperationById: (id: number) =>
    request.get<IOrderOperation>(URLS.ORDER_ITEM_OPERATIONS + id + "/"),
  deleteOrderOperation: (id: number) =>
    request.delete<IOrderOperation>(URLS.ORDER_ITEM_OPERATIONS + id + "/"),
};

export const OPERATIONS_API = {
  addOperation: (body: IProductOperationAddBody) =>
    request.post(URLS.OPERATIONS, body),
  getOperations: () =>
    request.get<IProductOperation[]>(URLS.OPERATIONS),
  getOperationById: (id: number) =>
    request.get<IProductOperation>(URLS.OPERATIONS + id + "/"),
  updateOperation: (id: number, body: IProductOperationAddBody) =>
    request.patch(URLS.OPERATIONS + id + "/", body),
};

export const ITEMS_API = {
  addItem: (body: IItemAddBody) =>
    request.post(URLS.ITEMS, body),
  getItems: () =>
    request.get<IItem[]>(URLS.ITEMS),
  geItemById: (id: number) =>
    request.get<IItem>(URLS.ITEMS + id + "/"),
  updateItem: (id: number, body: IItemAddBody) =>
    request.patch(URLS.ITEMS + id + "/", body),
};

export const TIMESPAN_API = {
  addTimespan: (body: ITimespanAddBody) =>
    request.post(URLS.TIMESPANS, body),
  updateTimespan: (id: number, body: ITimespanUpdateBody) =>
    request.patch(URLS.TIMESPANS + id + "/", body),
  getTimespan: (id: number) =>
    request.get<ITimespan>(URLS.TIMESPANS + id + "/"),
};

export const ORDER_ITEMS_API = {
  addOrderItem: (body: IOrderItemAddBody) =>
    request.post(URLS.ORDER_ITEMS, body),
  updateOrderItem: (id: number, body: IOrderItemUpdateBody) =>
    request.patch(URLS.ORDER_ITEMS + id + "/", body),
  getOrderItems: (orderId: number) =>
    request.get<Item[]>(URLS.ORDER_ITEMS + "order/"+ orderId + "/"),
  deleteOrderItem: (id: number) =>
    request.delete(URLS.ORDER_ITEMS + id + "/"),
};

export interface ITimespanAddBody {
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
  orderNumber: string;
  name: string;
  additionalInfo: string;
  estimatedTime: number;
  estimatedTimeUnit: string;
}