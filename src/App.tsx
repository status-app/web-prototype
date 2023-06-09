import type { Component } from "solid-js";
import { on, createEffect, createSignal } from "solid-js";

import { Nav } from "./Nav";
import { Route, Routes } from "@solidjs/router";
import type { Service } from "./api";
import { getServices } from "./api";
import { fetchSelfUser } from "./api";
import { ServiceList } from "./ServiceList";
import { Logout } from "./Logout";
import { Dashboard } from "./Dashboard";
import { apiResource } from "./solid-helper";
import { useLocation } from "@solidjs/router";

export const App: Component = () => {
  const userResource = apiResource(fetchSelfUser).fetch();
  createEffect(() => {
    if (userResource.error() && userResource.error() !== "auth") {
      console.log("Auth error:", userResource.error());
      alert(
        "An unknown error occurred while fetching the backend auth service!\n" +
          "Check the console for more insights.",
      );
    }
  });

  const [search, setSearch] = createSignal<string>(
    localStorage.getItem("search") ?? "",
  );

  const [items, setItems] = createSignal<Service[]>([]);

  const [filteredItems, setFilteredItems] = createSignal<Service[]>([]);

  const x = (_input: string, _prevInput: string) => {
    localStorage.setItem("search", _input);
    const input = _input.toLowerCase();
    setFilteredItems(
      input
        ? items().filter(
            (svc) =>
              svc.name.toLowerCase().includes(input) ||
              svc.description?.toLowerCase().includes(input),
          )
        : items(),
    );
  };

  createEffect(on(search, (_input, prevInput) => x(_input, prevInput)));

  createEffect(on(items, () => x(search(), search())));

  const servicesRes = apiResource(getServices).fetch();
  createEffect(() => {
    if (servicesRes.error()) {
      console.log(servicesRes.error());
      alert(
        "An error occurred while fetching services!\n" +
          "Check the console for more insights.",
      );
    }

    if (servicesRes.loaded()) {
      setItems(() => servicesRes.val()!);
    }
  });

  return (
    <div class="flex flex-col bg-gray-950 min-h-screen justify-between text-gray-50">
      <header class="sticky top-0 z-50 w-screen text-white bg-slate-800">
        <Nav
          searchSetter={
            useLocation().pathname === "/" || userResource.val()
              ? setSearch
              : null
          }
          userResource={userResource}
        />
      </header>
      <div class="w-full flex flex-wrap justify-center gap-3 p-4">
        <Routes>
          <Route path="/" element={<ServiceList items={filteredItems} />} />
          <Route path="/~">
            <Route
              path="/"
              element={
                <Dashboard userResource={userResource} items={filteredItems} />
              }
            />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </div>
      <footer class="px-5 xl:px-12 py-6 w-screen text-center bg-slate-800">
        <ul>
          <li>
            This app is a <b>prototype</b>. It is powered by the&nbsp;
            <a class="underline" href="https://github.com/status-app/backend">
              status-app/backend
            </a>{" "}
            project. Its source is available on{" "}
            <a
              class="underline"
              href="https://github.com/status-app/web-prototype"
            >
              GitHub
            </a>
            .
          </li>
          <li class="-mt-1">(c) statusapp.xyz - 2023</li>
        </ul>
      </footer>
    </div>
  );
};
