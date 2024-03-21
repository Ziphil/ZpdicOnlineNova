/* eslint-disable @typescript-eslint/no-namespace */

import rison from "rison";
import {Search} from "/client/hook/search";
import {WordType} from "/client/skeleton/word-parameter/word-parameter";
import {LiteralType} from "/server/util/literal-type";


export interface AdvancedWordParameterElement {

  text: string;
  title: string;
  mode: AdvancedWordMode;
  type: WordType;

}


export namespace AdvancedWordParameterElement {

  export const EMPTY = {
    text: "",
    title: "",
    mode: "name",
    type: "exact"
  } satisfies AdvancedWordParameterElement;

}


export interface AdvancedWordParameter {

  elements: Array<AdvancedWordParameterElement>;

}


export namespace AdvancedWordParameter {

  export const EMPTY = {
    elements: [AdvancedWordParameterElement.EMPTY]
  } satisfies AdvancedWordParameter;

  export function deserialize(search: Search): AdvancedWordParameter {
    if (search.has("advanced")) {
      const data = rison.decode<any>(search.get("advanced")!);
      const parameter = {elements: data.elements};
      return parameter;
    } else {
      const parameter = {elements: []};
      return parameter;
    }
  }

  export function serialize(parameter: AdvancedWordParameter): Search {
    const search = new URLSearchParams();
    search.set("advanced", rison.encode(parameter));
    return search;
  }

}


export const ADVANCED_WORD_MODES = ["name", "equivalent", "tag", "information", "variation", "relation", "content"] as const;
export type AdvancedWordMode = LiteralType<typeof ADVANCED_WORD_MODES>;