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