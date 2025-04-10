//

import merge from "lodash.merge";
import {Search} from "/client/hook/search";
import {
  ExampleIgnoreOptions,
  ExampleMode,
  ExampleModeUtil,
  ExampleType,
  ExampleTypeUtil
} from "/client/skeleton/example-parameter/example-parameter";


export interface NormalExampleParameter {

  kind: "normal";
  text: string;
  mode: ExampleMode;
  type: ExampleType;
  options: NormalExampleParameterOptions;

}


export namespace NormalExampleParameter {

  export const EMPTY = {
    kind: "normal",
    text: "",
    mode: "both",
    type: "prefix",
    options: {
      ignore: {case: false}
    }
  } satisfies NormalExampleParameter;

  export function deserialize(search: Search): NormalExampleParameter {
    const text = (search.has("text")) ? search.get("text") : undefined;
    const mode = (search.has("mode")) ? ExampleModeUtil.cast(search.get("mode")) : undefined;
    const type = (search.has("type")) ? ExampleTypeUtil.cast(search.get("type")) : undefined;
    const ignoreCase = (search.has("ignoreCase")) ? search.get("ignoreCase") === "true" : undefined;
    const ignore = (ignoreCase !== undefined) ? {case: ignoreCase} : undefined;
    const options = {ignore};
    const parameter = merge({}, EMPTY, {text, mode, type, options});
    return parameter;
  }

  export function serialize(parameter: NormalExampleParameter): Search {
    const search = new URLSearchParams();
    search.set("text", parameter.text);
    search.set("mode", parameter.mode);
    search.set("type", parameter.type);
    search.set("ignoreCase", parameter.options.ignore.case.toString());
    return search;
  }

}


export type NormalExampleParameterOptions = {
  ignore: ExampleIgnoreOptions
};