export type Service = { name: string; desc?: string };

export type User = { id: number; login: string };

const API_BASE_URL = `http://${window.location.hostname}:3000/v1`;

const token = () => localStorage.getItem("token");

const _fetch = async <T = null, R = null>(
  endpoint: string,
  method: "get" | "post" | "patch",
  body?: T,
): Promise<R> => {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token()) {
    headers.set("Authorization", `${token()}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.headers.has("Authorization")) {
    localStorage.setItem("token", res.headers.get("Authorization") as string);
  }

  const json = await res.json();
  if (res.status !== 200) {
    throw json.error;
  }

  return json;
};

const get = async <T = null, R = null>(endpoint: string): Promise<R> =>
  _fetch<T, R>(endpoint, "get");

const post = async <T = null, R = null>(
  endpoint: string,
  body: T,
): Promise<R> => _fetch<T, R>(endpoint, "post", body);

export const redirectToLogin = (
  type: "google" | "twitter" | "discord" | "steam",
) => {
  window.location.href = `${API_BASE_URL}/auth/${type}`;
};

export const fetchSelfUser = async (): Promise<User> => get("/user");

export const fetchUser = async (id: number) => get(`/users/${id}`);

export const basicLogin = async (
  login: string,
  password: string,
): Promise<User> => post("/auth/basic", { login, password });

export const revokeToken = async () => post("/auth/revoke", { token });
