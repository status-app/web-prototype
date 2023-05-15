/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { A } from "@solidjs/router";
import type { Component, Setter } from "solid-js";
import type { User } from "./api";
import type { APIResource } from "./solid-helper";

type Props = {
  searchSetter: Setter<string>;
  userResource: APIResource<User, []>;
};

export const Nav: Component<Props> = (props: Props) => (
  <nav class="flex justify-between w-full text-lg">
    <div class="px-5 xl:px-12 py-6 flex w-full items-center">
      <A class="text-3xl font-bold font-heading mr-auto" href="/">
        {/* <!-- <img class="h-9" src="logo.png" alt="logo"> --> */}
        <span class="hidden sm:inline">statusapp.xyz</span>
        <span class="sm:hidden">statusapp</span>
      </A>
      <div class="hidden md:flex px-4 absolute left-1/2 -translate-x-1/2 text-slate-500">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <span class="px-5 icon-before icon-solid icon-magnifying-glass"></span>
        </span>
        <input
          class="invalid:w-32 invalid:text-slate-500 text-white border-2 border-gray-600 bg-gray-800 py-1 rounded-md pl-10 pr-2 focus:outline-none hover:w-80 focus:w-80 w-80 transition-width"
          maxLength="24"
          required
          type="text"
          onInput={(ev) => {
            props.searchSetter((ev.target as HTMLInputElement).value || "");
          }}
          placeholder="search..."
          value={localStorage.getItem("search") ?? ""}
        ></input>
      </div>
      <div class="flex items-center ml-auto children:ml-3">
        {/* <a class="flex items-center hover:text-gray-200 icon-before icon-solid icon-right-to-bracket icon-space-sm" href="#">
        log in
      </a> */}

        {props.userResource.val() ? (
          <>
            <span class="flex icon-before icon-solid icon-user icon-space-sm">
              {props.userResource.val()!.login}
            </span>
            <A
              class="flex hover:text-gray-400 icon-before icon-solid icon-dashboard icon-space-sm"
              href="/~"
            >
              dashboard
            </A>
            <A
              class="text-red-500 hover:text-red-600 icon-before icon-solid icon-arrow-right-from-bracket icon-space-sm"
              href="/~/logout"
            />
          </>
        ) : (
          <A
            href="~"
            class="flex hover:text-gray-400 icon-before icon-solid icon-arrow-right-to-bracket icon-space-sm"
          >
            log in
          </A>
        )}
      </div>
    </div>
  </nav>
);
