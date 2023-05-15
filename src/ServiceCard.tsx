import type { Component } from "solid-js";

type Props = { name: string };

export const ServiceCard: Component<Props> = (props: Props) => (
  <div class="flex-1 min-w-[332px] max-w-[412px] p-4 border rounded-lg shadow bg-gray-800 border-gray-700">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
      {props.name}
    </h5>
    <p class="mb-3 font-normal text-gray-400 whitespace-nowrap">...</p>
  </div>
);
