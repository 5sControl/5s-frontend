import { ORDERS_API, TIMESPAN_API } from "../api/orders";
import { STATUS } from "../models/enums/statuses.enum";
import { AxiosError } from "axios";
import { IOrders, IReference } from "../models/interfaces/orders.interface";
import {
    IOrderOperation,
    IOrderWithAllOperations,
    IProductOperation
} from "../models/interfaces/operationItem.interface";
import { ITimespan } from "./../models/interfaces/orders.interface"
import { ITimespanAddBody } from './../api/orders'
import React from "react";


const updateOrder = async (id: number, body: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void): Promise<void> => {
    try {
        setLoading && setLoading(true)
        const update = await ORDERS_API.updateOrder(id, body);
        if (update.status === STATUS.OK) {
            callback()
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const getOrders = async (setItems: React.Dispatch<React.SetStateAction<IOrders[]>>,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>): Promise<void> => {
    try {
       setLoading && setLoading(true)
        const orders = await ORDERS_API.getOrders();
        if (orders.status === STATUS.OK) {
            setItems(orders.data)
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const getOrder = async (id: number, setItems: React.Dispatch<React.SetStateAction<IOrderWithAllOperations>>,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>): Promise<void> => {
    try {
        setLoading && setLoading(true)
        const order = await ORDERS_API.getOrder(id);
        if (order.status === STATUS.OK) {
            setItems(order.data)
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const getOrderWithOperations = async (id: number, setItems: React.Dispatch<React.SetStateAction<IOrderWithAllOperations>>,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>): Promise<void> => {
    try {
        setLoading && setLoading(true)
        const order = await ORDERS_API.getOrder(id);
        const operatrions = await ORDERS_API.getOrderOperation(id)
        if (order.status === STATUS.OK && operatrions.status === STATUS.OK) {
            console.log({ ...order.data, operations: operatrions.data })
            setItems({ ...order.data, operations: operatrions.data })
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const addOrder = async ({
    name,
    operationIds
}: IAddOrder, setLoading?: React.Dispatch<React.SetStateAction<boolean>>, setMessage?: React.Dispatch<React.SetStateAction<string | null>>, setCallback?: () => void) => {
    try {
        setLoading && setLoading(true)
        const orders = await ORDERS_API.addOrder(name, operationIds);
        if (orders.status !== STATUS.CREATED) {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)

    } finally {
        setLoading && setLoading(false)
        setCallback && setCallback()
    }
}
const getOperations = async (setItems: React.Dispatch<React.SetStateAction<IProductOperation[]>>,
    setReferences: React.Dispatch<React.SetStateAction<IReference[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const references = await ORDERS_API.getReferences();
        const operations = await ORDERS_API.getOperations(6);
        if (operations.status === STATUS.OK) {
            setItems(operations.data);
            setReferences(references.data);
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const getOrderOperations = async (id: number, setItems: React.Dispatch<React.SetStateAction<IOrderOperation[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operation = await ORDERS_API.getOrderOperation(id)
        if (operation.status === STATUS.OK) {
            setItems(operation.data)
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const getOrderOperationsById = async (id: number, operationId: number, setItems: React.Dispatch<React.SetStateAction<IOrderOperation>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operation = await ORDERS_API.getOrder(id)
        if (operation.status === STATUS.OK) {

            const filtered = operation.data.operations.find(e => e.id === operationId)
            filtered && setItems(filtered)

        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const getOrderParams = async (id: number, setItems: React.Dispatch<React.SetStateAction<IOrderOperation[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operation = await ORDERS_API.getOrderOperation(id)
        if (operation.status === STATUS.OK) {
            setItems(operation.data)
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const addTimespan = async (id: number, body: ITimespanAddBody, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void) => {
    try {
        setLoading(true)
        const operation = await TIMESPAN_API.addTimespan(id, body)
        if (operation.status === STATUS.CREATED) {
            callback()
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}
const updateTimespan = async (id: number, body: ITimespanAddBody, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void) => {
    try {
        setLoading(true)
        const operation = await TIMESPAN_API.updateTimespan(id, body)
        if (operation.status === STATUS.OK) {
            callback()
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}

const getTimespan = async (id: number, setTimespan: React.Dispatch<React.SetStateAction<ITimespan>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operation = await TIMESPAN_API.getTimespan(id)
        if (operation.status === STATUS.OK) {            
            setTimespan(operation.data)
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}

const getOperationReferenceItems = async (id: number, setOperationReferenceItems: React.Dispatch<React.SetStateAction<IReference[]>>, 
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const referenceItems = await ORDERS_API.getOperationReferenceItems(id);
        if (referenceItems.status === STATUS.OK) {            
            setOperationReferenceItems(referenceItems.data)
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        setMessage && setMessage(err.message)
    } finally {
        setLoading && setLoading(false)
    }
}

export const ORDER_REQUEST = {
    updateOrder,
    getOrders,
    getOrder,
    addOrder,
    getOrderOperations,
    getOrderWithOperations,
    getOrderOperationsById,
    getOrderParams
}
export const OPERATION_REQUEST = {
    getOperations,
    getOperationReferenceItems
}
export const TIMESPAN_REQUEST = {
    addTimespan,
    updateTimespan,
    getTimespan
}

interface IAddOrder {
    name: string;
    operationIds: number[]
}
