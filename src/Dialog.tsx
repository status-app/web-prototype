import type { Accessor, Component, JSX, Setter } from "solid-js";
import { onCleanup, onMount } from "solid-js";

interface Props {
  text: JSX.Element;
  tooltipText?: JSX.Element;
  color?: string;
  closeButtonText?: string;
  isOpen: Accessor<boolean>;
  setOpen: Setter<boolean>;
  children: JSX.Element;
}

export const Dialog: Component<Props> = (props: Props) => {
  const { isOpen, setOpen } = props;

  onMount(() => {
    let throttled = false;
    const handleKeypress = (ev: KeyboardEvent) => {
      if (throttled) return;

      throttled = true;

      const activeEl = document.activeElement;
      const hasActiveEl = activeEl && activeEl.tagName.toLowerCase() !== "body";

      if (ev.key === "Escape") {
        ev.preventDefault();
        if (hasActiveEl) {
          return (activeEl as HTMLElement).blur();
        }
        return document.getElementById("dialog-cancel")?.click();
      }

      if (ev.key === "Enter") {
        if (!ev.ctrlKey && ev.target instanceof HTMLTextAreaElement) return;

        ev.preventDefault();
        if (hasActiveEl) {
          let foundEl = null;
          for (const el of document.querySelectorAll("input, textarea")) {
            console.log("x" + el);
            if (foundEl === "next") {
              foundEl = el;
              break;
            }
            if (el === activeEl) foundEl = "next";
          }
          console.log(foundEl);
          if (foundEl && foundEl !== "next") {
            return (foundEl as HTMLElement).focus();
          }
        }

        document.getElementById("dialog-confirm")?.click();
      }

      // setTimeout(() => throttled = false, 500);
    };

    document.addEventListener("keydown", handleKeypress);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeypress);
    });
  });

  return (
    <div class="dialog text-black inline">
      <span
        onClick={() => setOpen(true)}
        class={
          "tooltip text-" +
          (props.color ?? "white") +
          " relative cursor-pointer"
        }
      >
        <span>{props.text}</span>

        {props.tooltipText && (
          <span class="pointer-events-none tooltip-text absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-2 py-1 text-xs rounded">
            {props.tooltipText}
          </span>
        )}
      </span>

      {isOpen() && (
        <>
          <div
            id="dialog-out"
            class="fixed inset-0 flex items-center justify-center z-50 bg-opacity-60 bg-black"
            onClick={(ev) =>
              ev.button === 0 && ev.target.id === "out" && setOpen(false)
            }
          >
            <div class="bg-white rounded p-8">{props.children}</div>
          </div>
        </>
      )}
    </div>
  );
};

interface DialogButtonProps {
  text: string;
  type?: "confirm" | "cancel";
  color?: string;
  bgColor?: string;
  hoverBgColor?: string;
  onClick?: () => void;
}

export const DialogButton: Component<DialogButtonProps> = (
  props: DialogButtonProps,
) => {
  const type = props.type ? `dialog-${props.type}` : "";
  const color = props.color || "white";
  const bgColor = props.bgColor || "gray-500";
  const hoverBgColor = props.hoverBgColor || "gray-700";

  const dynamicClass = `mt-4 bg-${bgColor} hover:bg-${hoverBgColor} text-${color} font-bold py-2 px-4 rounded`;

  return (
    <button id={type} onClick={props.onClick} class={dynamicClass}>
      {props.text}
    </button>
  );
};
