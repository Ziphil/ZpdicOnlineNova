/* eslint-disable @typescript-eslint/no-namespace */

import rison from "rison";
import {Search} from "/client-new/hook/search";
import {WORD_MODES, WordMode, WordType} from "/client-new/skeleton/word-parameter/word-parameter";


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


export const ADVANCED_WORD_MODES = WORD_MODES.filter((mode) => mode !== "both") as Array<AdvancedWordMode>;
export type AdvancedWordMode = Exclude<WordMode, "both">;