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

  kind: "advanced";
  elements: Array<AdvancedWordParameterElement>;

}


export namespace AdvancedWordParameter {

  export const EMPTY = {
    kind: "advanced",
    elements: [AdvancedWordParameterElement.EMPTY]
  } satisfies AdvancedWordParameter;

  export function deserialize(search: Search): AdvancedWordParameter {
    if (search.get("kind") === "advanced") {
      const data = rison.decode<any>(search.get("advanced")!);
      const parameter = {kind: "advanced", elements: data.elements} satisfies AdvancedWordParameter;
      return parameter;
    } else {
      const parameter = {kind: "advanced", elements: []} satisfies AdvancedWordParameter;
      return parameter;
    }
  }

  export function serialize(parameter: AdvancedWordParameter): Search {
    const search = new URLSearchParams();
    search.set("kind", "advanced");
    search.set("advanced", rison.encode(parameter));
    return search;
  }

}


export const ADVANCED_WORD_MODES = ["name", "equivalent", "tag", "information", "variation", "relation", "content"] as const;
export type AdvancedWordMode = LiteralType<typeof ADVANCED_WORD_MODES>;