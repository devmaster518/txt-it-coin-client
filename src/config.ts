import { path } from 'src/routes/path';

// API
// ----------------------------------------------------------------------
export const API_URL = import.meta.env.VITE_API_URL;
export const ASSETS_URL = import.meta.env.VITE_ASSETS_URL;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = path.statistics.root; // as '/dashboard'
