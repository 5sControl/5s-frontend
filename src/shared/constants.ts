export const ROUTES = {
  MENU: '/mobile/',
  AUTHORIZATION: '/mobile/authorization',
  CONFIGURATION: '/mobile/configuration',
  CONNECTIONS: '/mobile/configuration/connections',
  CONNECTIONS_ADD: '/mobile/configuration/connections/add',
  CONNECTIONS_ITEM: (erp: string) => `/mobile/configuration/connections/${erp}`,
  CONNECTIONS_EDIT: (erp: string) => `/mobile/configuration/connections/${erp}/edit`,
  DATABASE: '/mobile/database',
  DATABASE_CATEGORY: (category: string) => `/mobile/database/${category}`,
  DATABASE_ADD_ENTRY: (category: string) => `/mobile/database/${category}/addEntry`,
  DATABASE_EDIT_ENTRY: (category: string, entry: string, id: string) =>
    `/mobile/database/${category}/${entry}/${id}/edit`,
};
