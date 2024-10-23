export const ROUTES = {
  MENU: "/mobile/",
  ORDERS: "/mobile/orders",
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
  DIRECTORY_CATEGORY: (refId: string) => `/mobile/directories/${refId}`,
  DIRECTORY_CATEGORY_ADD: (refId: string) => `/mobile/directories/${refId}/add`,
  DIRECTORY_CATEGORY_CARD: (refId: string, card: string) => `/mobile/directories/${refId}/${card}`,
  DIRECTORY_CATEGORY_EDIT: (refId: string, card: string) => `/mobile/directories/${refId}/${card}/edit`,
  ORDERSVIEW: "/mobile/orders-view",
  OPERATIONDETAIL: (id: string) => `mobile/orders-view/operation-detail/${id}`

};
