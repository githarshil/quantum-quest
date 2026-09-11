/**
 * Quantum Quest — API Configuration
 *
 * In production on Netlify, requests point to VITE_API_URL or the live Railway backend.
 * In local development, falls back to http://127.0.0.1:8000.
 */
const DEFAULT_DEV_URL = 'http://127.0.0.1:8000';
const DEFAULT_PROD_URL = 'https://quantum-quest-api-production-be5f.up.railway.app';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? DEFAULT_DEV_URL : DEFAULT_PROD_URL)
).replace(/\/+$/, '');

