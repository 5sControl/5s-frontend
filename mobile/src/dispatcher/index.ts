import { ITEMS_API, ITimespanUpdateBody, OPERATIONS_API, ORDER_ITEMS_API, ORDERS_API, TIMESPAN_API } from "../api/orders";
import { STATUS } from "../models/enums/statuses.enum";
import { AxiosError } from "axios";
import { ICompleteOrder, IOrderItemTimespan, IOrders } from "../models/interfaces/orders.interface";
import {
    IOrderOperation,
    IOrderOperationAddBody,
    IProductOperation,
    IProductOperationAddBody
} from "../models/interfaces/operationItem.interface";
import { ITimespan } from "./../models/interfaces/orders.interface"
import { ITimespanAddBody } from './../api/orders'
import { IAddOrder } from "../api/orders";
import React from "react";
import { IItem, IItemAddBody, IOrderItemAddBody, IOrderItemUpdateBody, Item } from "../models/interfaces/item.interface";


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
const getOrderById = async (id: number, setItems: React.Dispatch<React.SetStateAction<IOrders>>,
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
const addOrder = async (body: IAddOrder, setLoading?: React.Dispatch<React.SetStateAction<boolean>>, setMessage?: React.Dispatch<React.SetStateAction<string | null>>, setCallback?: () => void) => {
    try {
        setLoading && setLoading(true)
        const order = await ORDERS_API.addOrder(body);
        if (order.status === STATUS.CREATED) {
            return order.data;
        } else {
            throw new Error('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        throw err;
    } finally {
        setLoading && setLoading(false)
        setCallback && setCallback()
    }
}
const completeOrder = async (body: ICompleteOrder, setLoading?: React.Dispatch<React.SetStateAction<boolean>>, setMessage?: React.Dispatch<React.SetStateAction<string | null>>, setCallback?: () => void) => {
    try {
        setLoading && setLoading(true)
        const order = await ORDERS_API.completeOrder(body);
        if (order.status === STATUS.OK) {
            return true;
        } else {
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
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true);
        const operations = await OPERATIONS_API.getOperations();
        if (operations.status === STATUS.OK) {
            setItems(operations.data);
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

const getOperationById = async (id: number, setItem: React.Dispatch<React.SetStateAction<IProductOperation>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true);
        const operation = await OPERATIONS_API.getOperationById(id);
        if (operation.status === STATUS.OK) {
            setItem(operation.data);
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

const addOperation = async (body: IProductOperationAddBody, setLoading?: React.Dispatch<React.SetStateAction<boolean>>, setMessage?: React.Dispatch<React.SetStateAction<string | null>>, setCallback?: () => void) => {
    try {
        setLoading && setLoading(true)
        const operation = await OPERATIONS_API.addOperation(body);
        if (operation.status !== STATUS.CREATED) {
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

const updateOperation = async (id: number, body: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void): Promise<void> => {
    try {
        setLoading && setLoading(true)
        const update = await OPERATIONS_API.updateOperation(id, body);
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

///////////////////////////////////////////////////////////////

const getOrderItemOperations = async (orderItemId: number, setOperations: React.Dispatch<React.SetStateAction<IOrderOperation[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operations = await ORDERS_API.getOrderItemOperations(orderItemId)
        if (operations.status === STATUS.OK) {
            setOperations(operations.data)
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
const getOrderOperationById = async (id: number, setItem: React.Dispatch<React.SetStateAction<IOrderOperation>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operation = await ORDERS_API.getOrderOperationById(id)
        if (operation.status === STATUS.OK) {
            setItem(operation.data)
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

const addOrderItemOperation = async (body: IOrderOperationAddBody, setLoading?: React.Dispatch<React.SetStateAction<boolean>>, setMessage?: React.Dispatch<React.SetStateAction<string | null>>, setCallback?: () => void) => {
    try {
        setLoading && setLoading(true)
        const operation = await ORDERS_API.addOrderItemOperation(body);
        if (operation.status !== STATUS.CREATED) {
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

const deleteOrderItemOperation = async (id: number, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void) => {
    try {
        setLoading(true)
        const operation = await ORDERS_API.deleteOrderOperation(id);
        if (operation.status === STATUS.DELETED) {
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

const getOrderItemOperationsByName = async (orderId: number, orderItemName: string, setItems: React.Dispatch<React.SetStateAction<IOrders[]>>,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage?: React.Dispatch<React.SetStateAction<string | null>>): Promise<void> => {
    try {
        setLoading && setLoading(true);
        const operations = await ORDERS_API.getOrderItemOperationsByName(orderId, orderItemName);
        if (operations.status === STATUS.OK) {
            setItems(operations.data)
        } else {
            setMessage && setMessage('Something went wrong')
        }
    } catch (e) {
        const err = e as AxiosError
        if (err.status === STATUS.NOT_FOUND) {
            setItems([]);
        }
        else {
            setMessage && setMessage(err.message)
        }
    } finally {
        setLoading && setLoading(false)
    }
}

const addTimespan = async (body: ITimespanAddBody, setTimespan: React.Dispatch<React.SetStateAction<ITimespan>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operation = await TIMESPAN_API.addTimespan(body)
        if (operation.status === STATUS.CREATED) {
            // callback();
            setTimespan(operation.data);
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
const updateTimespan = async (id: number, body: ITimespanUpdateBody, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback?: () => void) => {
    try {
        setLoading(true)
        const operation = await TIMESPAN_API.updateTimespan(id, body)
        if (operation.status === STATUS.OK) {
            if (callback)
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

const getOrderItemTimespans = async (orderItemId: number, setTimespans: React.Dispatch<React.SetStateAction<IOrderItemTimespan[]>>, setOrderItemName: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const orderItem = await TIMESPAN_API.getOrderItemTimespans(orderItemId)
        if (orderItem.status === STATUS.OK) {
            setTimespans(orderItem.data.timespans || []);
            setOrderItemName(orderItem.data.timespans[0]?.orderOperation?.order_item?.name || '');
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

//////////////////////////////////////////////////

const getOrderItems = async (id: number, setOrderItems: React.Dispatch<React.SetStateAction<Item[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true)
        const operation = await ORDER_ITEMS_API.getOrderItems(id)
        if (operation.status === STATUS.OK) {
            setOrderItems(operation.data)
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

const createOrderItem = async (body: IOrderItemAddBody, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void) => {
    try {
        setLoading(true)
        const orderItem = await ORDER_ITEMS_API.addOrderItem(body);
        if (orderItem.status === STATUS.CREATED) {
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

const updateOrderItem = async (id: number, body: IOrderItemUpdateBody, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void) => {
    try {
        setLoading(true)
        const orderItem = await ORDER_ITEMS_API.updateOrderItem(id, body)
        if (orderItem.status === STATUS.CREATED) {
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

const getItems = async (setItems: React.Dispatch<React.SetStateAction<IItem[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true);
        const items = await ITEMS_API.getItems();
        if (items.status === STATUS.OK) {
            setItems(items.data);
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

const getItemById = async (id: number, setItem: React.Dispatch<React.SetStateAction<IItem>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        setLoading(true);
        const item = await ITEMS_API.getItemById(id);
        if (item.status === STATUS.OK) {
            setItem(item.data);
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

const addItem = async (body: IItemAddBody, setLoading?: React.Dispatch<React.SetStateAction<boolean>>, setMessage?: React.Dispatch<React.SetStateAction<string | null>>, setCallback?: () => void) => {
    try {
        setLoading && setLoading(true)
        const item = await ITEMS_API.addItem(body);
        if (item.status !== STATUS.CREATED) {
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

const updateItem = async (id: number, body: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void): Promise<void> => {
    try {
        setLoading && setLoading(true)
        const update = await ITEMS_API.updateItem(id, body);
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

const deleteOrderItem = async (id: number, setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMessage: React.Dispatch<React.SetStateAction<string | null>>, callback: () => void) => {
    try {
        setLoading(true)
        const orderItem = await ORDER_ITEMS_API.deleteOrderItem(id)
        if (orderItem.status === STATUS.DELETED) {
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

export const ORDER_REQUEST = {
    updateOrder,
    getOrders,
    getOrderById,
    addOrder,
    completeOrder,
    getOrderItemOperations,
    getOrderOperationById,
    addOrderItemOperation,
    deleteOrderItemOperation,
    getOrderItemOperationsByName
    // getOrderParams
}
export const ORDER_ITEM_REQUEST = {
    getOrderItems,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem
}
export const OPERATION_REQUEST = {
    getOperations,
    getOperationById,
    addOperation,
    updateOperation
}
export const ITEM_REQUEST = {
    getItems,
    getItemById,
    addItem,
    updateItem
}
export const TIMESPAN_REQUEST = {
    addTimespan,
    updateTimespan,
    getTimespan,
    getOrderItemTimespans
}


