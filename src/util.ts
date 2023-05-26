import type { Accessor } from "solid-js";

export type Accessored<T> = { [Prop in keyof T]: Accessor<T[Prop]> };
