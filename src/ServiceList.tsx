import type { Accessor, Component } from "solid-js";
import { createSignal } from "solid-js";
import { For } from "solid-js";
import { ServiceCard } from "./ServiceCard";
import type { Service } from "./api";
import { ServiceMethods, createService } from "./api";
import { Dialog, DialogButton } from "./Dialog";
import { apiResource } from "./solid-helper";

import isValidHostname from "is-valid-hostname";

type Props = { items: Accessor<Service[]>; showTools?: boolean };

export const ServiceList: Component<Props> = (props: Props) => {
  const [createDialogShown, showCreateDialog] = createSignal(false);
  const { items, showTools } = props;
  return (
    <>
      <For each={items()}>
        {(svc) => <ServiceCard service={svc} showTools={props.showTools} />}
      </For>

      {!props.items().length && !showTools && (
        <h2 class="text-center italic">nothing to show...</h2>
      )}
    </>
  );
};
