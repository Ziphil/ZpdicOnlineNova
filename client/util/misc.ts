//

import {
  Repeat
} from "typescript-tuple";


export function swap<T>(array: Array<T>, index: number, direction: 1 | -1): Array<T> {
  let targetIndex = index + direction;
  if (index >= 0 && index < array.length && targetIndex >= 0 && targetIndex < array.length) {
    let temp = array[index];
    array[index] = array[targetIndex];
    array[targetIndex] = temp;
  }
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
  let result = [] as any;
  for (let i = 0 ; sliceLength * i < array.length ; i ++) {
    let slice = array.slice(sliceLength * i, sliceLength * (i + 1));
    if (fill) {
      let rest = new Array(sliceLength - slice.length);
      slice.push(...rest.fill(undefined));
    }
    result.push(slice);
  }
  return result;
}

export function trimIndent(strings: TemplateStringsArray, ...expressions: Array<any>): string {
  let finalStrings = [];
  for (let i = 0 ; i < strings.length ; i ++) {
    finalStrings.push(strings[i]);
    if (i !== strings.length - 1) {
      finalStrings.push(expressions[i].toString());
    }
  }
  let string = finalStrings.join("");
  let splitString = string.split(/\n/).filter((line) => !line.match(/^\s*$/));
  let indentLength = splitString.reduce((indentLength, line) => {
    let match = line.match(/^(\s*)/);
    if (match && indentLength > match[1].length) {
      return match[1].length;
    } else {
      return indentLength;
    }
  }, 1000);
  let trimmedString = splitString.map((line) => {
    let regexp = new RegExp("^\\s{" + indentLength + "}");
    return line.replace(regexp, "");
  });
  let result = trimmedString.join("\n");
  return result;
}

export function hasTypedOwnProperty<T extends object>(object: T, key: string | symbol | number): key is keyof T {
  return object.hasOwnProperty(key);
}

export function createValidate(pattern: RegExp | ((value: string) => boolean), message?: string): (value: string) => string | null {
  if (pattern instanceof RegExp) {
    let validate = function (value: string): string | null {
      return (value.match(pattern)) ? null : (message ?? "");
    };
    return validate;
  } else {
    let validate = function (value: string): string | null {
      return (pattern(value)) ? null : (message ?? "");
    };
    return validate;
  }
}