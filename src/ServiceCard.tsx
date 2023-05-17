import type { Component } from "solid-js";
import type { Service } from "./api";

type Props = { service: Service; showTools?: boolean };

export const ServiceCard: Component<Props> = (props: Props) => (
  <div class="flex-1 min-w-[332px] max-w-[412px] p-4 border rounded-lg shadow bg-gray-800 border-gray-700">
    <div class="flex">
      <h5 class="flex-1 mb-2 text-2xl font-bold tracking-tight text-white">
        {props.service.name}
      </h5>
      {props.showTools && (
        <div>
          <a href="#" class="icon-before icon-pen icon-solid text-orange-400">
            &nbsp;
          </a>
          &nbsp;
          <a
            href="#"
            class="icon-before icon-trash icon-solid text-red-500"
          ></a>
        </div>
      )}
    </div>
    <p class="mb-3 font-normal text-gray-400 whitespace-nowrap">...</p>
  </div>
);
