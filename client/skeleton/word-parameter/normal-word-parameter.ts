//

import merge from "lodash.merge";
import {Search} from "/client/hook/search";
import {
  WordIgnoreOptions,
  WordMode,
  WordModeUtil,
  WordOrder,
  WordOrderDirectionUtil,
  WordOrderModeUtil,
  WordType,
  WordTypeUtil
} from "/client/skeleton/word-parameter/word-parameter";


export interface NormalWordParameter {

  kind: "normal";
  text: string;
  mode: WordMode;
  type: WordType;
  order: WordOrder;
  options: NormalWordParameterOptions;

}


export namespace NormalWordParameter {

  export const EMPTY = {
    kind: "normal",
    text: "",
    mode: "both",
    type: "prefix",
    order: {mode: "unicode", direction: "ascending"},
    options: {
      ignore: {case: false},
      shuffleSeed: null,
      enableSuggestions: true
    }
  } satisfies NormalWordParameter;

  export function deserialize(search: Search): NormalWordParameter {
    const text = (search.has("text")) ? search.get("text") : undefined;
    const mode = (search.has("mode")) ? WordModeUtil.cast(search.get("mode")) : undefined;
    const type = (search.has("type")) ? WordTypeUtil.cast(search.get("type")) : undefined;
    const orderMode = (search.has("orderMode")) ? WordOrderModeUtil.cast(search.get("orderMode")) : undefined;
    const orderDirection = (search.has("orderDirection")) ? WordOrderDirectionUtil.cast(search.get("orderDirection")) : undefined;
    const order = {mode: orderMode, direction: orderDirection};
    const ignoreCase = (search.has("ignoreCase")) ? search.get("ignoreCase") === "true" : undefined;
    const ignore = (ignoreCase !== undefined) ? {case: ignoreCase} : undefined;
    const shuffleSeed = (search.has("shuffleSeed")) ? search.get("shuffleSeed") : undefined;
    const enableSuggestions = (search.has("enableSuggestions")) ? search.get("enableSuggestions") === "true" : undefined;
    const options = {ignore, shuffleSeed, enableSuggestions};
    const parameter = merge({}, EMPTY, {text, mode, type, order, options});
    return parameter;
  }

  export function serialize(parameter: NormalWordParameter): Search {
    const search = new URLSearchParams();
    search.set("text", parameter.text);
    search.set("mode", parameter.mode);
    search.set("type", parameter.type);
    search.set("orderMode", parameter.order.mode);
    search.set("orderDirection", parameter.order.direction);
    search.set("ignoreCase", parameter.options.ignore.case.toString());
    if (parameter.options.shuffleSeed !== null) {
      search.set("shuffleSeed", parameter.options.shuffleSeed);
    }
    search.set("enableSuggestions", parameter.options.enableSuggestions.toString());
    return search;
  }

}


export type NormalWordParameterOptions = {
  ignore: WordIgnoreOptions,
  shuffleSeed: string | null,
  enableSuggestions: boolean
};