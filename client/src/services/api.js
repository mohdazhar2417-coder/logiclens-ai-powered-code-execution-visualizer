import { clearStoredSession, getStoredToken } from "./auth.js";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "" : "http://localhost:5000");

async function request(path, options = {}) {
  const token = getStoredToken();
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error(
      `Cannot reach the LogicLens API at ${API_URL}. Start the backend or set VITE_API_URL to your deployed server URL.`,
    );
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
    }
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

export const api = {
  signup: (body) => request("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/auth/me"),
  updateProfile: (body) => request("/api/auth/profile", { method: "PUT", body: JSON.stringify(body) }),
  listPrograms: () => request("/api/programs"),
  detect: (body) => request("/api/detect", { method: "POST", body: JSON.stringify(body) }),
  explain: (body) => request("/api/explain", { method: "POST", body: JSON.stringify(body) }),
  finalSummary: (body) => request("/api/final-summary", { method: "POST", body: JSON.stringify(body) }),
  createTrace: (body) => request("/api/traces", { method: "POST", body: JSON.stringify(body) }),
  listTraces: () => request("/api/traces"),
  getTrace: (id) => request(`/api/traces/${id}`),
  deleteTrace: (id) => request(`/api/traces/${id}`, { method: "DELETE" }),
  listFavorites: () => request("/api/favorites"),
  addFavorite: (programId) => request("/api/favorites", { method: "POST", body: JSON.stringify({ programId }) }),
  deleteFavorite: (id) => request(`/api/favorites/${id}`, { method: "DELETE" }),
  adminPrograms: () => request("/api/admin/programs"),
  createProgram: (body) => request("/api/admin/programs", { method: "POST", body: JSON.stringify(body) }),
  updateProgram: (id, body) =>
    request(`/api/admin/programs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProgram: (id) => request(`/api/admin/programs/${id}`, { method: "DELETE" }),
};
