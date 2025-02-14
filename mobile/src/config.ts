export const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_BASE_URL
    : '__VITE_API_BASE_URL__';

export const APP_VERSION =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_VERSION
    : '__APP_VERSION__';

export const API_BASE_PATH = import.meta.env.BASE_URL;