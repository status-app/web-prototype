import type { Accessor, Component } from "solid-js";
import { For } from "solid-js";
import { ServiceCard } from "./ServiceCard";
import type { Service } from "./api";

type Props = { items: Accessor<Service[]> };

export const ServiceList: Component<Props> = (props: Props) => (
  <>
    {props.items().length ? (
      <For each={props.items()}>{(svc) => <ServiceCard name={svc.name} />}</For>
    ) : (
      <h2 class="text-center italic">
        nothing to show - try another search...
      </h2>
    )}
  </>
);
