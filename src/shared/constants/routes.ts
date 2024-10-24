export const ROUTES = {
  MENU: "/mobile/", 
  GUIDES: "/mobile/guides",
  GUIDES_ADD: "mobile/guides/new",
  AUTHORIZATION: "/authorization",
  CONFIGURATION: "/mobile/configuration",
  CONNECTIONS: "/mobile/configuration/connections",
  CONNECTIONS_ADD: "/mobile/configuration/connections/add",
  CONNECTIONS_ITEM: (erp: string) => `/mobile/configuration/connections/${erp}`,
  CONNECTIONS_EDIT: (erp: string) =>
    `/mobile/configuration/connections/${erp}/edit`,
  DATABASE: "/mobile/database",
  DATABASE_CATEGORY: (category: string) => `/mobile/database/${category}`,
  DATABASE_ADD_ENTRY: (category: string) =>
    `/mobile/database/${category}/addEntry`,
  DATABASE_EDIT_ENTRY: (category: string, entry: string, id: string) =>
    `/mobile/database/${category}/${entry}/${id}/edit`,

  GENEREAL_DIRECTORIES: "/mobile/general-directories",
  DIRECTORIES_ADD: "/mobile/general-directories/add",
  DIRECTORIES_ITEM_CARD: (card: string) => `/mobile/general-directories/${card}`,
  DIRECTORIES_EDIT_CARD: (card: string) => `/mobile/general-directories/${card}/edit`,
  DIRECTORIES: "/mobile/directories",
  DIRECTORY_CATEGORY: (category: string, refId: string) => `/mobile/directories/${category}/${refId}`,
  DIRECTORY_CATEGORY_ADD: (category: string, refId: string) => `/mobile/directories/${category}/${refId}/add`,
  DIRECTORY_CATEGORY_CARD: (card: string) => `/mobile/directories/${card}`,
  DIRECTORY_CATEGORY_EDIT: (card: string) => `/mobile/directories/${card}/edit`,
  ORDERSVIEW: "/mobile/orders-view",
  OPERATIONDETAIL: (id: string) => `mobile/orders-view/operation-detail/${id}`,

  ORDERS: "/mobile/orders",
  ORDER: "/mobile/order",
  ORDER_OPERATIONS: "/mobile/order/operations",
  ORDER_ITEM: (id: string) =>  `/mobile/order/${id}`,
  ORDER_ITEM_EDIT: (id: string) =>  `/mobile/order/${id}/edit`,
  ORDER_OPERATION: (id: string, operationId: string) => `/mobile/order/${id}/operation/${operationId}`,
  ORDER_TIMESPAN: (id: string, operationId: string) => `/mobile/order/${id}/operation/${operationId}/timespan`,
  ORDER_TIMESPAN_EDIT: (id: string, operationId: string, timespanId: string) => `/mobile/order/${id}/operation/${operationId}/timespan/${timespanId}/edit`


};
