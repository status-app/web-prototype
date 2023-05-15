import type { Component } from "solid-js";
import { on, createEffect, createSignal } from "solid-js";

import { Nav } from "./Nav";
import { Route, Routes } from "@solidjs/router";
import type { Service } from "./api";
import { fetchSelfUser } from "./api";
import { ServiceList } from "./ServiceList";
import { Logout } from "./Logout";
import { Dashboard } from "./Dashboard";
import { apiResource } from "./solid-helper";

export const App: Component = () => {
  const userResource = apiResource(fetchSelfUser).fetch();

  const [search, setSearch] = createSignal<string>(
    localStorage.getItem("search") ?? "",
  );
  const [items, setItems] = createSignal<Service[]>([]);
  const [filteredItems, setFilteredItems] = createSignal<Service[]>([]);

  createEffect(
    on(search, (_input, prevInput) => {
      localStorage.setItem("search", _input);
      const input = _input.toLowerCase();
      if (input === prevInput?.toLowerCase()) return;
      setFilteredItems(
        input
          ? items().filter(
              (svc) =>
                svc.name.toLowerCase().includes(input) ||
                svc.desc?.toLowerCase().includes(input),
            )
          : items(),
      );
    }),
  );

  setItems(
    [...Array(213).keys()].map(
      (i) => ({ name: `Service ${i + 1}` } as Service),
    ),
  ); // TODO

  return (
    <div class="flex flex-col bg-gray-950 min-h-screen justify-between text-gray-50">
      <header class="sticky top-0 z-50 w-screen text-white bg-slate-800">
        <Nav searchSetter={setSearch} userResource={userResource} />
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
            <a class="underline" href="https://github.com/status-app/backend">status-app/backend</a> project. Its source
            is available on <a class="underline" href="https://github.com/status-app/web-prototype">GitHub</a>.
          </li>
          <li class="-mt-1">
            (c) statusapp.xyz - 2023
          </li>
        </ul>
      </footer>
    </div>
  );
};
