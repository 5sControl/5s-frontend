export const ROUTES = {

  MENU: "/",

  AUTHORIZATION: "/authorization",
  CONFIGURATION: "/configuration",
  CONNECTIONS: "/configuration/connections",
  CONNECTIONS_ADD: "/configuration/connections/add",
  CONNECTIONS_ITEM: (erp: string) => `/configuration/connections/${erp}`,
  CONNECTIONS_EDIT: (erp: string) =>
    `/configuration/connections/${erp}/edit`,

  GENEREAL_DIRECTORIES: "/general-directories",
  DIRECTORIES_ADD: "/general-directories/add",
  DIRECTORIES_ITEM_CARD: (card: string) => `/general-directory/${card}`,
  DIRECTORIES_EDIT_CARD: (card: string) => `/general-directory/${card}/edit`,
  DIRECTORIES: "/directories",
  DIRECTORY_CATEGORY: (refId: string) => `/directories/${refId}`,
  DIRECTORY_CATEGORY_ADD: (refId: string) => `/directories/${refId}/add`,
  DIRECTORY_CATEGORY_CARD: (refId: string, card: string) => `/directory/${refId}/${card}`,
  DIRECTORY_CATEGORY_EDIT: (refId: string, card: string) => `/directory/${refId}/${card}/edit`,
  ORDERSVIEW: "/orders-view",
  OPERATIONDETAIL: (id: string) => `/orders-view/operation-detail/${id}`,
  ORDERS: "/orders",
  ORDER: "/order",
  ORDER_ITEM: (id: string) => `/order/${id}`,
  ORDER_ITEM_EDIT: (id: string) => `/order/${id}/edit`,
  ORDER_OPERATION: (id: string, operationId: string) => `/order/${id}/operation/${operationId}`,
  ORDER_ADD_OPERATION: "/order/operations/add",
  ORDER_OPERATION_ADD_REFERENCE: (id: string, operationId: string, refId: string) => `/order/${id}/operation/${operationId}/reference/${refId}`,
  ORDER_TIMESPAN: (id: string, operationId: string) => `/order/${id}/operation/${operationId}/timespan`,
  ORDER_TIMESPAN_EDIT: (id: string, operationId: string, timespanId: string) => `/order/${id}/operation/${operationId}/timespan/${timespanId}/edit`,
  SCANNER: "/scanner"
};