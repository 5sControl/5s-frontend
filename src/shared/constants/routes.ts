export const ROUTES = {
  MENU: "/v1/mobile/",
  ORDERS: "/v1/mobile/orders",
  GUIDES: "/v1/mobile/guides",
  GUIDES_ADD: "/v1/mobile/guides/new",
  AUTHORIZATION: "/authorization",
  CONFIGURATION: "/v1/mobile/configuration",
  CONNECTIONS: "/v1/mobile/configuration/connections",
  CONNECTIONS_ADD: "/v1/mobile/configuration/connections/add",
  CONNECTIONS_ITEM: (erp: string) => `/v1/mobile/configuration/connections/${erp}`,
  CONNECTIONS_EDIT: (erp: string) =>
    `/v1/mobile/configuration/connections/${erp}/edit`,
  DATABASE: "/v1/mobile/database",
  DATABASE_CATEGORY: (category: string) => `/v1/mobile/database/${category}`,
  DATABASE_ADD_ENTRY: (category: string) =>
    `/v1/mobile/database/${category}/addEntry`,
  DATABASE_EDIT_ENTRY: (category: string, entry: string, id: string) =>
    `/v1/mobile/database/${category}/${entry}/${id}/edit`,

  GENEREAL_DIRECTORIES: "/v1/mobile/general-directories",
  DIRECTORIES_ADD: "/v1/mobile/general-directories/add",
  DIRECTORIES_ITEM_CARD: (card: string) => `/v1/mobile/general-directories/${card}`,
  DIRECTORIES_EDIT_CARD: (card: string) => `/v1/mobile/general-directories/${card}/edit`,
  DIRECTORIES: "/v1/mobile/directories",
  DIRECTORY_CATEGORY: (refId: string) => `/v1/mobile/directories/${refId}`,
  DIRECTORY_CATEGORY_ADD: (refId: string) => `/v1/mobile/directories/${refId}/add`,
  DIRECTORY_CATEGORY_CARD: (refId: string, card: string) => `/v1/mobile/directories/${refId}/${card}`,
  DIRECTORY_CATEGORY_EDIT: (refId: string, card: string) => `/v1/mobile/directories/${refId}/${card}/edit`,
  ORDERSVIEW: "/v1/mobile/orders-view",
  OPERATIONDETAIL: (id: string) => `/v1/mobile/orders-view/operation-detail/${id}`

};
