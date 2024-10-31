import axios from "axios";
import { getCookieValueByName } from "../utils/helpers";
import { IReference, ITimespan } from "../models/interfaces/orders.interface";
import {
  IOrderOperation,
  IProductOperation,
  IOrderWithAllOperations,
} from "../models/interfaces/operationItem.interface";

const BASE = "api/erp-reference";
const URLS = {
  ORDERS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order/`,
  ADD_ORDER: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order/`,
  UPDATE_ORDER: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order/`,
  GET_ORDER: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order/`,
  GET_REFERENCES: `${import.meta.env.VITE_API_BASE_URL}${BASE}/reference/`,
  GET_OPERATIONS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/reference-operation/`,
  UPDATE_OPERATION: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order/`,
  GET_ORDER_OPERATION: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-operation/`,
  GET_OPERATION_REFERENCE_ITEMS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/reference-items/`,
  UPDATE_OPERATION_REFERENCE_ITEMS: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-operation/{id}/extension/`,
  ADD_TIMESPAN: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-operation/{id}/timespan/`,
  UPDATE_TIMESPAN: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-operation-timespan/`,
  GET_TIMESPAN: `${import.meta.env.VITE_API_BASE_URL}${BASE}/order-operation-timespan/`,
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
  addOrder: (name: string, operationIds: number[]) =>
    request.post(URLS.ADD_ORDER, { name, operationIds }),
  getOrder: (id: number) =>
    request.get<IOrderWithAllOperations>(URLS.GET_ORDER + id + "/"),
  getReferences: () => request.get<IReference[]>(URLS.GET_REFERENCES),
  getOperations: (id: number) =>
    request.get<IProductOperation[]>(URLS.GET_OPERATIONS + id + "/"),
  updateOrder: (id: number, body: any) =>
    request.patch(URLS.UPDATE_OPERATION + id + "/", body),
  getOrderOperation: (id: number) =>
    request.get<IOrderOperation>(URLS.GET_ORDER_OPERATION + id + "/"),
  getOperationReferenceItems: (id: number) =>
    request.get<IReference[]>(URLS.GET_OPERATION_REFERENCE_ITEMS + id + "/"),
  addOperationReferenceItem: (id: number, body: any) =>
    request.post(URLS.UPDATE_OPERATION_REFERENCE_ITEMS.replace("{id}", String(id)), body)
};
export const TIMESPAN_API = {
  addTimespan: (id: number, body: ITimespanAddBody) =>
    request.post(URLS.ADD_TIMESPAN.replace("{id}", String(id)), body),
  updateTimespan: (id: number, body: ITimespanAddBody) =>
    request.patch(URLS.UPDATE_TIMESPAN + id + "/", body),
  getTimespan: (id: number) =>
    request.get<ITimespan>(URLS.GET_TIMESPAN + id + "/"),
};

export interface ITimespanAddBody {
  startedAt: string;
  finishedAt?: string;
}

export interface IOperationReferenceUpdateBody {
  referenceItemIds: number[];
}