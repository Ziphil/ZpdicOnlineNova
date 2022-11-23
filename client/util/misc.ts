//

import {
  Repeat
} from "typescript-tuple";
import {
  Validate,
  ValidationSpec
} from "/client/component/atom/input";


export function swap<T>(array: Array<T>, index: number, direction: 1 | -1): Array<T> {
  const targetIndex = index + direction;
  if (index >= 0 && index < array.length && targetIndex >= 0 && targetIndex < array.length) {
    const temp = array[index];
    array[index] = array[targetIndex];
    array[targetIndex] = temp;
  }
  return array;
}

export function moveAt<T>(array: Array<T>, fromIndex: number, toIndex: number): Array<T> {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
  return array;
}

export function deleteAt<T>(array: Array<T>, index: number): Array<T> {
  if (index >= 0 && index < array.length) {
    array.splice(index, 1);
  }
  return array;
}

export function slices<T, N extends number>(array: Array<T>, sliceLength: N, fill: true): Array<Repeat<T | undefined, N>>;
export function slices<T, N extends number>(array: Array<T>, sliceLength: N, fill?: false): Array<Repeat<T, N>>;
export function slices<T, N extends number>(array: Array<T>, sliceLength: N, fill?: boolean): Array<Repeat<T | undefined, N>> {
  const result = [] as any;
  for (let i = 0 ; sliceLength * i < array.length ; i ++) {
    const slice = array.slice(sliceLength * i, sliceLength * (i + 1));
    if (fill) {
      const rest = new Array(sliceLength - slice.length);
      slice.push(...rest.fill(undefined));
    }
    result.push(slice);
  }
  return result;
}

export function trimIndent(strings: TemplateStringsArray, ...expressions: Array<any>): string {
  const finalStrings = [];
  for (let i = 0 ; i < strings.length ; i ++) {
    finalStrings.push(strings[i]);
    if (i !== strings.length - 1) {
      finalStrings.push(expressions[i].toString());
    }
  }
  const string = finalStrings.join("");
  const splitString = string.split(/\n/).filter((line) => !line.match(/^\s*$/));
  const indentLength = splitString.reduce((indentLength, line) => {
    const match = line.match(/^(\s*)/);
    if (match && indentLength > match[1].length) {
      return match[1].length;
    } else {
      return indentLength;
    }
  }, 1000);
  const trimmedString = splitString.map((line) => {
    const regexp = new RegExp("^\\s{" + indentLength + "}");
    return line.replace(regexp, "");
  });
  const result = trimmedString.join("\n");
  return result;
}

export function hasTypedOwnProperty<T extends object>(object: T, key: string | symbol | number): key is keyof T {
  return object.hasOwnProperty(key);
}

export function calcOffset(page: number, size: number): {offset: number, size: number} {
  const offset = size * page;
  return {offset, size};
}

export function createValidate(pattern: RegExp | ((value: string) => boolean), message?: string): Validate {
  if (pattern instanceof RegExp) {
    const validate = function (value: string): ValidationSpec | null {
      if (value === "" || value.match(pattern)) {
        return null;
      } else {
        return {scheme: "red", iconName: "exclamation-triangle", message: message ?? ""};
      }
    };
    return validate;
  } else {
    const validate = function (value: string): ValidationSpec | null {
      if (value === "" || pattern(value)) {
        return null;
      } else {
        return {scheme: "red", iconName: "exclamation-triangle", message: message ?? ""};
      }
    };
    return validate;
  }
}

export function escapeHtml(string: string): string {
  const escapedString = string.replace(/["'&<>]/g, (char) => {
    if (char === "\"") {
      return "&quot;";
    } else if (char === "'") {
      return "&#39;";
    } else if (char === "&") {
      return "&amp;";
    } else if (char === "<") {
      return "&lt;";
    } else if (char === ">") {
      return "&gt;";
    } else {
      return char;
    }
  });
  return escapedString;
}

export function createDummyText(length: number): string {
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  const fullText = new Array(length).fill(text).join(" ");
  return fullText;
}