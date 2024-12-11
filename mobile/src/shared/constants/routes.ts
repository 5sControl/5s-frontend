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

  OPERATIONS: "/operations",
  OPERATION_ADD: "/operations/add",
  OPERATION: (operationId: string) => `/operation/${operationId}`,
  OPERATION_EDIT: (operationId: string) => `/operation/${operationId}/edit`,

  ITEMS: "/items",
  ITEM_ADD: "/items/add",
  ITEM: (operationId: string) => `/item/${operationId}`,
  ITEM_EDIT: (operationId: string) => `/item/${operationId}/edit`,

  EMPLOYEES: "/employees",
  EMPLOYEE_ADD: "/employees/add",
  EMPLOYEE: (employeeId: string) => `/employee/${employeeId}`,
  EMPLOYEE_EDIT: (employeeId: string) => `/employee/${employeeId}/edit`,

  ORDERSVIEW: "/orders-view",
  OPERATIONDETAIL: (id: string) => `/orders-view/operation-detail/${id}`,
  ORDERS: "/orders",
  ORDER_ADD: "/orders/add",
  ORDER: (id: string) => `/order/${id}`,
  ORDER_EDIT: (id: string) => `/order/${id}/edit`,
  ORDER_ITEM: (orderId: string, itemId: string) => `/order/${orderId}/item/${itemId}`,
  ORDER_ITEM_EDIT: (orderId: string, itemId: string) => `/order/${orderId}/item/${itemId}/edit`,
  ORDER_ITEM_ADD: (orderId: string, itemId: string) => `/order/${orderId}/item/${itemId}/add`,
  ORDER_OPERATION: (orderId: string, itemId: string, operationId: string) => `/order/${orderId}/item/${itemId}/operation/${operationId}`,
  ORDER_ADD_ITEM: `/order/items/add`,
  ORDER_ADD_ITEM_INFO: `/order/items/add/info`,
  ORDER_ADD_OPERATION: `/order/items/add/info/operations`,
  ORDER_OPERATION_ADD_REFERENCE: (orderId: string, itemId: string, operationId: string, refId: string) => `/order/${orderId}/item/${itemId}/operation/${operationId}/reference/${refId}`,
  ORDER_TIMESPAN: (orderId: string, itemId: string, operationId: string) => `/order/${orderId}/item/${itemId}/operation/${operationId}/timespan`,
  ORDER_TIMESPAN_EDIT: (orderId: string, itemId: string, operationId: string, timespanId: string) => `/order/${orderId}/item/${itemId}/operation/${operationId}/timespan/${timespanId}/edit`,

  REPORTS: `/reports`,
  REPORT: `/report`,
  REPORTS_INDIVIDUAL: `/reports-individual`,
  REPORT_EMPLOYEE: (employeeId: string) => `/report/${employeeId}`,

  SCANNER_QR: `/scanner`,
  LANGUAGE: `/language`,

  USERS: "/users",
  USER: (id: string) => `/user/${id}`,
  USER_ADD: "/users/add",
  USER_EDIT: (id: string) => `/user/${id}/edit`,
  USER_WORKPLACES: "/users/workplaces",
  USER_EDIT_WORKPLACES: (id: string) => `/user/${id}/edit/workplaces`,

  CAMERAS: "/cameras",
  CAMERA_ADD: "/cameras/add",
  CAMERA_EDIT: (id: string) => `/camera/${id}/edit`,
};