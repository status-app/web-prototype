import type { Accessor, Component } from "solid-js";
import { For } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import type { Service, User } from "./api";
import { ServiceMethods, createService } from "./api";
import { redirectToLogin } from "./api";
import { basicLogin as _basicLogin } from "./api";
import { ServiceList } from "./ServiceList";
import type { APIResource } from "./solid-helper";
import { apiResource } from "./solid-helper";
import { useSearchParams } from "@solidjs/router";
import { Dialog, DialogButton } from "./Dialog";
import isValidHostname from "is-valid-hostname";

type Props = {
  userResource: APIResource<User, []>;
  items: Accessor<Service[]>;
};

export const Dashboard: Component<Props> = (props: Props) => {
  const [searchParams] = useSearchParams();
  if (searchParams["token"]) {
    localStorage.setItem("token", searchParams["token"]);
    location.href = location.pathname;
    return;
  }

  const error: string | undefined = searchParams["error"];
  if (error) {
    // Clean error from URL without reloading
    const url = new URL(location.href);
    url.searchParams.delete("error");
    history.replaceState({}, document.title, url.toString());
  }

  const newUserResource = apiResource(_basicLogin);

  // const [status, setStatus] = createSignal<null | "pending" | "ok" | "error">(null);
  // const [error, setError] = createSignal<string | null>(null);

  const [login, setLogin] = createSignal("");
  const [password, setPassword] = createSignal("");

  const doLogin = (ev: SubmitEvent) => {
    ev.preventDefault();

    if (newUserResource.status() === "fetching") return;
    newUserResource.fetch(login(), password());
  };

  createEffect(() => {
    if (newUserResource.val()) {
      props.userResource.fetch();
    }
  });

  return (
    <>
      {!props.userResource.val() ? ( // No user? Login. User? Show dashboard
        <div class="w-64 children:w-full">
          <div class="text-center">
            <span
              class="cursor-pointer"
              onClick={(_) => redirectToLogin("google")}
            >
              use Google
            </span>
            {/*•&nbsp;
            <span
              class="cursor-pointer"
              onClick={(_) => redirectToLogin("discord")}
            >
              Discord
            </span>{" "}
            •&nbsp;
            <span
              class="cursor-pointer"
              onClick={(_) => redirectToLogin("steam")}
            >
              Steam
            </span>*/}

            {
              /* Back-end error */ error && (
                <>
                  <hr class="mt-1" />
                  <span class="text-red-500">{error}</span>
                </>
              )
            }
            {newUserResource.status() === "error" && (
              <>
                <hr class="mt-1" />
                <span class="text-red-500">
                  Error: {newUserResource.error()}
                </span>
              </>
            )}
            {newUserResource.status() === "fetching" && (
              <>
                <hr class="mt-1" />
                <span class="text-orange-500">Processing...</span>
              </>
            )}
            {newUserResource.status() === "ok" && (
              <>
                <hr class="mt-1" />
                <span class="text-green-500">Processing...</span>
              </>
            )}
          </div>
          <hr class="mt-1" />
          {newUserResource.status() === "error" && (
            <span class="text-red-500">Error: {newUserResource.error()}</span>
          )}
          {newUserResource.status() === "fetching" && (
            <span class="text-orange-500">Processing...</span>
          )}
          {newUserResource.status() === "ok" && (
            <>
              <span class="text-green-500">Processing...</span>
            </>
          )}
          <form onSubmit={(ev) => doLogin(ev)} class="children:w-full mt-2">
            <div class="table children:table-cell">
              <span class="icon-before icon-user icon-solid">&nbsp;</span>
              <input
                id="login"
                class="p-1 w-full"
                type="text"
                placeholder="login"
                onChange={(e) => setLogin((e.target as HTMLInputElement).value)}
                onKeyDown={(e) =>
                  e.key.toLowerCase() === "arrowdown" &&
                  document.getElementById("password")?.focus()
                }
              />
            </div>
            <div class="table children:table-cell mt-2">
              <span class="icon-before icon-lock icon-solid">&nbsp;</span>
              <input
                id="password"
                class="p-1 w-full"
                type="password"
                placeholder="password"
                onChange={(e) =>
                  setPassword((e.target as HTMLInputElement).value)
                }
                onKeyDown={(e) =>
                  (e.key.toLowerCase() === "arrowup" &&
                    document.getElementById("login")?.focus()) ||
                  (e.key.toLowerCase() === "arrowdown" &&
                    document.getElementById("submit")?.focus())
                }
              />
            </div>
            <div class="text-center">
              <input
                id="submit"
                class="cursor-pointer p-1"
                type="submit"
                value="submit"
                onKeyDown={(e) =>
                  e.key.toLowerCase() === "arrowup" &&
                  document.getElementById("password")?.focus()
                }
              />
            </div>
          </form>
        </div>
      ) : (
        <>
          <CreateDialog />
          <ServiceList items={props.items} showTools={true} />
        </>
      )}
    </>
  );
};

const CreateDialog: Component = () => {
  const createSvcRes = apiResource(createService);

  const [isOpen, setOpen] = createSignal(false);

  const [name, setName] = createSignal("");
  const [desc, setDesc] = createSignal("");
  const [method, setMethod] = createSignal("");
  const [host, setHost] = createSignal("");

  return (
    <Dialog
      color="green-500"
      text={<span class="icon-before icon-add icon-solid">&nbsp;Add</span>}
      isOpen={isOpen}
      setOpen={setOpen}
    >
      <h1 class="text-xl text-center">Add a new service</h1>

      {createSvcRes.status() === "ok" && (window.location.href = "?")}
      {createSvcRes.status() === "fetching" && (
        <span class="text-orange-500">Loading...</span>
      )}
      {createSvcRes.status() === "error" && (
        <span class="text-red-500">Error! {createSvcRes.error()}</span>
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
          onInput={(e) => setMethod(e.currentTarget.value)}
        >
          <option disabled selected>
            -- Choose one
          </option>
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
            if (!name() || name().length < 2 || name().length > 24) {
              alert("Name has to be 2-24 chars");
              return;
            }
            if (!method()) {
              alert("No method selected");
              return;
            }
            if (!host()) {
              alert("No host provided");
              return;
            }
            // if (!isValidHostname(host())) {
            //   alert("Invalid host");
            //   return;
            // }
            createSvcRes.fetch({
              name: name(),
              method: { name: method(), options: { host: host() } },
              description: desc() || undefined,
            });
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
