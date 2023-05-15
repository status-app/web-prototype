import type { Accessor, Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import type { Service, User } from "./api";
import { redirectToLogin } from "./api";
import { basicLogin as _basicLogin } from "./api";
import { ServiceList } from "./ServiceList";
import type { APIResource } from "./solid-helper";
import { apiResource } from "./solid-helper";
import { useSearchParams } from "@solidjs/router";

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
              Google
            </span>{" "}
            •&nbsp;
            <span
              class="cursor-pointer"
              onClick={(_) => redirectToLogin("twitter")}
            >
              Twitter
            </span>{" "}
            •&nbsp;
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
            </span>
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
        <ServiceList items={props.items} />
      )}
    </>
  );
};
