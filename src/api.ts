// TODO common type pkg

import type { Accessor } from "solid-js";
import type { Accessored } from "./util";

export type Service = {
  readonly id: number;
  name: string;
  description?: string;
  method: ServiceMethod;
  uptime: "ok" | "warn" | "critical";
};

export type AccessoredService = Accessored<Omit<Service, "id">>;

export type ServiceMethod = { name: string; options: { host: string } };
export const ServiceMethods = ["http", "ping"];

export type User = { id: number; login: string };

const API_BASE_URL = `http://${window.location.hostname}:3000/v1`;

const token = () => localStorage.getItem("token");

const _fetch = async <T = null, R = null>(
  endpoint: string,
  method: "get" | "post" | "patch" | "delete",
  body?: T,
): Promise<R> => {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token()) {
    headers.set("Authorization", `${token()}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: method.toUpperCase(),
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.headers.has("Authorization")) {
    localStorage.setItem("token", res.headers.get("Authorization") as string);
  }

  if (res.status === 204) return null as any;

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

const patch = async <T = null, R = null>(
  endpoint: string,
  body: T,
): Promise<R> => _fetch<T, R>(endpoint, "patch", body);

const _delete = async <T = null, R = null>(
  endpoint: string,
  body: T,
): Promise<R> => _fetch<T, R>(endpoint, "delete", body);

export const redirectToLogin = (type: "google" | "discord" | "steam") => {
  window.location.href = `${API_BASE_URL}/auth/${type}`;
};

export const fetchSelfUser = async (): Promise<User> => get("/user");

export const fetchUser = async (id: number) => get(`/users/${id}`);

export const basicLogin = async (
  login: string,
  password: string,
): Promise<User> => post("/auth/basic", { login, password });

export const revokeToken = async () => post("/auth/revoke", { token });

export const getServices = async (): Promise<Service[]> => get("/");

export const createService = async (svc: Omit<Omit<Service, "id">, "uptime">) =>
  post("/", svc);

export const deleteService = async (svc: Service) =>
  _delete<Service>(`/${svc.id}`, svc);

export const updateService = async (
  svc: Service,
  name: string,
  desc: string,
  methodName: string,
  methodHost: string,
) =>
  patch<Partial<Service>, Service>(`/${svc.id}`, {
    name: name,
    description: desc,
    method: {
      name: methodName,
      options: { host: methodHost },
    },
  });
