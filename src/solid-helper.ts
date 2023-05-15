/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

export type Status = null | "fetching" | "ok" | "error";

export type APIResource<T, A extends any[]> = {
  status: Accessor<Status>;
  loaded: () => boolean;
  val: Accessor<T | null>;
  error: Accessor<string | null>;
  fetch: (...args: A) => APIResource<T, A>;
};

export const apiResource = <T, A extends any[]>(
  fn: (...args: A) => Promise<T>,
): APIResource<T, A> => {
  const [status, setStatus] = createSignal<Status>(null);
  const [data, setData] = createSignal<T | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  const ret = {
    status,
    loaded: () => status() !== null && status() !== "fetching",
    val: data,
    error,
    fetch: (...args: A) => {
      setStatus(() => "fetching");

      fn(...args)
        .then((value) => {
          if (value as T) {
            setData(() => value);
            setStatus(() => "ok");
            return;
          }
          console.error(
            "Error while casting when getting api resource from fn",
            fn.name,
          );
          setError(() => "unknown");
          setStatus(() => "error");
        })
        .catch((error) => {
          if (error.stack) {
            console.error("Error while fetching from fn", fn.name, ":", error);
            setError(() => "unknown");
          } else {
            setError(() => error);
          }
          setStatus(() => "error");
        });

      return ret;
    },
  };

  return ret;
};
