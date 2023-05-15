import type { Component } from "solid-js";
import { Navigate } from "@solidjs/router";
import { revokeToken } from "./api";
import { apiResource } from "./solid-helper";

export const Logout: Component = () => {
  const logoutResource = apiResource(revokeToken).fetch();
  (() => {
    // TODO
    window.location.href = "/";
    localStorage.removeItem("token");
  })();

  return (
    <div class="text-center text-xl">
      <div>Processing...</div>
      {logoutResource.status() === "ok" && <Navigate href="/" />}
      {logoutResource.status() === "error" && (
        <div class="text-red-600">An error occured!</div>
      )}
    </div>
  );
};
