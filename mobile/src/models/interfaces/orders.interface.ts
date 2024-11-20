import {IOperation} from "./operationItem.interface";
import { OperationStatus } from "../types/ordersStatus";

export interface IOrders {
    id: number
    status: OperationStatus
    name: string
    orderNumber: number
    orderYear: number
    createdAt: string
    updatedAt: string
    estimatedAt: string
    startedAt: string
    completedAt: string
    timeTaken: number
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