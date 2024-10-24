export const ROUTES = {
  MENU: "/",
  ORDERS: "/orders",
  GUIDES: "/guides",
  GUIDES_ADD: "/guides/new",
  AUTHORIZATION: "/authorization",
  CONFIGURATION: "/configuration",
  CONNECTIONS: "/configuration/connections",
  CONNECTIONS_ADD: "/configuration/connections/add",
  CONNECTIONS_ITEM: (erp: string) => `/configuration/connections/${erp}`,
  CONNECTIONS_EDIT: (erp: string) =>
    `/configuration/connections/${erp}/edit`,
  DATABASE: "/database",
  DATABASE_CATEGORY: (category: string) => `/database/${category}`,
  DATABASE_ADD_ENTRY: (category: string) =>
    `/database/${category}/addEntry`,
  DATABASE_EDIT_ENTRY: (category: string, entry: string, id: string) =>
    `/database/${category}/${entry}/${id}/edit`,

  GENEREAL_DIRECTORIES: "/general-directories",
  DIRECTORIES_ADD: "/general-directories/add",
  DIRECTORIES_ITEM_CARD: (card: string) => `/general-directories/${card}`,
  DIRECTORIES_EDIT_CARD: (card: string) => `/general-directories/${card}/edit`,
  DIRECTORIES: "/directories",
  DIRECTORY_CATEGORY: (refId: string) => `/directories/${refId}`,
  DIRECTORY_CATEGORY_ADD: (refId: string) => `/directories/${refId}/add`,
  DIRECTORY_CATEGORY_CARD: (refId: string, card: string) => `/directories/${refId}/${card}`,
  DIRECTORY_CATEGORY_EDIT: (refId: string, card: string) => `/directories/${refId}/${card}/edit`,
  ORDERSVIEW: "/orders-view",
  OPERATIONDETAIL: (id: string) => `/orders-view/operation-detail/${id}`

};
