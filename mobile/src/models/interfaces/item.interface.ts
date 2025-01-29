
export interface Item {
    id: number;
    quantity: number,
    name: string,
    itemId: number
    additionalInfo: string,
    order: {
        id: number,
        createdAt: string,
        updatedAt: string,
        estimatedTime: number,
        estimatedTimeUnit: string,
        additionalInfo: string,
        name: string,
        orderYear: number, 
        orderNumber: number
    }
}

export interface IItemAddBody {
    name: string
}

export interface IItem {
    id: number
    name: string
    createdAt: string
}

export interface IOrderItemAddBody {
    orderId: number,
    name: string,
    additionalInfo: string,
    quantity: number,
    itemId: number
}

export interface IOrderItemUpdateBody {
    name: string,
    additionalInfo: string,
    quantity: number,
    itemId: number
}