import { OperationStatus } from "../types/ordersStatus";
import { Item } from "./item.interface";

export interface OperationItem {
    filtration_operation_id: number,
    oprTypeID: number,
    oprName: string,
    oprs: {
        id: number,
        orId: string,
        sTime: number,
        eTime: number,
        duration: number,
        duration_expected: number
    }[]
}
export interface IOperation {
    id: number
    status: string
    createdAt: string
    updatedAt: string
    name: string
    estimated_time: number
    estimated_time_unit: string
}
export interface IProductOperation {
    id: number
    name: string
    createdAt: string
    estimatedTime: number
    estimatedTimeUnit: string
}

export interface IProductOperationAddBody {
    name: string
    estimatedTime: number
    estimatedTimeUnit: string
}

export interface IOperationSpan {
    timespanId: number
    name: string;
    startedAt: string
    finishedAt: string
    createdAt: string
    updatedAt: string
}
export interface IOrderOperation {
    id: number
    name: string
    operationId: number;
    status: OperationStatus
    totalDuration: number
    extensions: Extension[]
    timespans: Timespan[]
    orderItem: Item
}

export interface Extension {
    id: number
    name: string
    createdAt: string
    updatedAt: string
}

export interface Timespan {
    id: number
    startedAt: string
    finishedAt: string
    duration: number
    employeeName: string;
}

export interface IOrderOperationAddBody {
    operationIds: number[]
    orderItemId: number
}

