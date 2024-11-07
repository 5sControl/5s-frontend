import {IOperation} from "./operationItem.interface";
import { OperationStatus } from "../types/ordersStatus";

export interface IOrders {
    id: number
    name: string
    createdAt: string
    updatedAt: string
    estimatedTime: number,
    estimatedTimeUnit: string,
    additionalInfo: string,
}
export interface IReference {
    id: number
    name: string
    createdAt: string
}
 export interface ITimespan {
    timespanId: number
    startedAt: string
    finishedAt: string
    createdAt: string
    updatedAt: string
    employeeId: number
  }