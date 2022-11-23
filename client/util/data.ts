//

import {
  AriaAttributes
} from "react";


export function data(object: Record<string, string | boolean | null | undefined>): Partial<Record<`data-${string}`, string>> {
  const dataEntries = [];
  for (const [name, spec] of Object.entries(object)) {
    const snakeName = toSnakeCase(name);
    if (spec !== null && spec !== undefined) {
      if (typeof spec === "string") {
        dataEntries.push([`data-${snakeName}`, spec]);
      } else if (typeof spec === "boolean" && spec) {
        dataEntries.push([`data-${snakeName}`, "true"]);
      }
    }
  }
  const data = Object.fromEntries(dataEntries);
  return data;
}

export function aria(object: AriaObject): AriaAttributes {
  const dataEntries = [];
  for (const [name, value] of Object.entries(object)) {
    dataEntries.push([`aria-${name}`, value]);
  }
  const data = Object.fromEntries(dataEntries);
  return data;
}

function toSnakeCase(string: string): string {
  return string.replace(/([A-Z])/g, (char) => "-" + char.toLowerCase());
}

type AriaObject = {[K in keyof AriaAttributes as AriaName<K>]: AriaAttributes[K]};
type AriaName<K> = K extends `aria-${infer N}` ? N : never;