import type { Component } from "solid-js";
import { For } from "solid-js";
import { createSignal } from "solid-js";
import type { Service } from "./api";
import { deleteService } from "./api";
import { ServiceMethods, updateService } from "./api";
import { Dialog, DialogButton } from "./Dialog";
import { apiResource } from "./solid-helper";

type ServicedProps = { service: Service };

type Props = ServicedProps & { showTools?: boolean };

export const ServiceCard: Component<Props> = (props: Props) => (
  <div class="flex-1 min-w-[332px] max-w-[412px] p-4 border rounded-lg shadow bg-gray-800 border-gray-700">
    <div class="flex">
      <h5 class="flex-1 mb-2 text-2xl font-bold tracking-tight text-white">
        {props.service.name}
      </h5>
      {props.service.uptime === "ok" && <b class="text-green-500">UP</b>}
      {props.service.uptime === "warn" && <b class="text-orange-500">WARN</b>}
      {props.service.uptime === "critical" && <b class="text-red-500">DOWN</b>}
      {props.showTools && (
        <div class="ml-2">
          <EditDialog service={props.service} />
          &nbsp;
          <DeleteDialog service={props.service} />
        </div>
      )}
    </div>
    <p class="mb-3 font-normal text-gray-400 whitespace-nowrap">
      {props.service.description || "(no description)"}
    </p>
  </div>
);

const EditDialog: Component<ServicedProps> = (props: ServicedProps) => {
  const updateSvcRes = apiResource(updateService);

  const svc = props.service;
  const [isOpen, setOpen] = createSignal(false);

  const [name, setName] = createSignal(svc.name);
  const [desc, setDesc] = createSignal(svc.description ?? "");
  const [method, setMethod] = createSignal(svc.method.name);
  const [host, setHost] = createSignal(svc.method.options.host);

  return (
    <Dialog
      color="orange-400"
      text={<span class="icon-before icon-pen icon-solid">&nbsp;</span>}
      tooltipText="Edit"
      isOpen={isOpen}
      setOpen={setOpen}
    >
      <h1 class="text-xl text-center">
        Editing <b>{svc.name}</b> (id: {svc.id})
      </h1>

      {updateSvcRes.status() === "ok" && setOpen(false)}
      {updateSvcRes.status() === "fetching" && (
        <span class="text-orange-500">Loading...</span>
      )}
      {updateSvcRes.status() === "error" && (
        <span class="text-red-500">Error! {updateSvcRes.error()}</span>
      )}

      <div>
        Name:{" "}
        <input
          required
          type="text"
          onInput={(e) => setName(e.currentTarget.value)}
          value={name()}
        />
      </div>

      <div>
        Description:&nbsp;
        <textarea
          class="top-0"
          onload={(e) => (e.target.scrollTop = e.target.scrollHeight)}
          onInput={(e) => setDesc(e.currentTarget.value)}
          value={desc()}
        />
      </div>

      <div>
        Method:&nbsp;
        <select
          name="method"
          required
          value={method()}
          onInput={(e) => setMethod(e.currentTarget.value)}
        >
          <For each={ServiceMethods}>
            {(method, i) => <option value={method}>{method}</option>}
          </For>
        </select>
      </div>

      <div>
        Host/URL:{" "}
        <input
          type="text"
          required
          onInput={(e) => setHost(e.currentTarget.value)}
          value={host()}
        />
      </div>

      <div class="flex justify-center">
        <DialogButton
          type="confirm"
          text={"Done!"}
          bgColor="green-500"
          hoverBgColor="green-700"
          onClick={() => {
            updateSvcRes.fetch(svc, name(), desc(), method(), host());
          }}
        />
        &nbsp;
        <DialogButton
          type="cancel"
          text={"Cancel"}
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
    </Dialog>
  );
};

const DeleteDialog: Component<ServicedProps> = (props: ServicedProps) => {
  const deleteSvcRes = apiResource(deleteService);
  const [isOpen, setOpen] = createSignal(false);

  return (
    <Dialog
      color="red-500"
      text={<span class="icon-before icon-trash icon-solid"></span>}
      tooltipText="Delete"
      isOpen={isOpen}
      setOpen={setOpen}
    >
      Are you sure you want to delete the <b>{props.service.name}</b> service?
      {(deleteSvcRes.status() === "ok" || deleteSvcRes.error() === "unknown") &&
        (window.location.href = "?")}
      {deleteSvcRes.status() === "fetching" && (
        <p class="text-orange-500">Loading...</p>
      )}
      {deleteSvcRes.status() === "error" &&
        deleteSvcRes.error() !== "unknown" && (
          <p class="text-red-500">Error! {deleteSvcRes.error()}</p>
        )}
      <div class="flex justify-center">
        <DialogButton
          text="Yes!"
          bgColor="red-500"
          hoverBgColor="red-600"
          onClick={() => {
            deleteSvcRes.fetch(props.service);
          }}
        />
        &nbsp;
        <DialogButton text="Nevermind" onClick={() => setOpen(false)} />
      </div>
    </Dialog>
  );
};
