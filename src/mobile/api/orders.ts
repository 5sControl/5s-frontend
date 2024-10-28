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
  ORDERS: `${process.env.REACT_APP_NGROK}${BASE}/order/`,
  ADD_ORDER: `${process.env.REACT_APP_NGROK}${BASE}/order/`,
  UPDATE_ORDER: `${process.env.REACT_APP_NGROK}${BASE}/order/`,
  GET_ORDER: `${process.env.REACT_APP_NGROK}${BASE}/order/`,
  GET_REFERENCES: `${process.env.REACT_APP_NGROK}${BASE}/reference/`,
  GET_OPERATIONS: `${process.env.REACT_APP_NGROK}${BASE}/reference-operation/`,
  UPDATE_OPERATION: `${process.env.REACT_APP_NGROK}${BASE}/order/`,
  GET_ORDER_OPERATION: `${process.env.REACT_APP_NGROK}${BASE}/order-operation/order/`,
  ADD_TIMESPAN: `${process.env.REACT_APP_NGROK}${BASE}/order-operation/{id}/timespan/`,
  UPDATE_TIMESPAN: `${process.env.REACT_APP_NGROK}${BASE}/order-operation-timespan/`,
  GET_TIMESPAN: `${process.env.REACT_APP_NGROK}${BASE}/order-operation-timespan/`,
};

const request = axios.create({
  baseURL: process.env.REACT_APP_NGROK,
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
    request.get<IOrderOperation[]>(URLS.GET_ORDER_OPERATION + id + "/"),
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
