import axios from 'axios';

// Every axios call in this app uses relative paths (e.g. '/api/v1/products').
// In dev that works via Vite's proxy (vite.config.js) straight to localhost.
// In a real deployment the frontend and backend are usually on different
// origins, so VITE_URL points axios at the deployed backend directly, and
// withCredentials makes sure the auth cookie still gets sent cross-origin
// (the backend's CORS middleware must allow that specific origin - see
// FRONTEND_URL in backend/.env).
axios.defaults.baseURL = import.meta.env.VITE_URL || '';
axios.defaults.withCredentials = true;
