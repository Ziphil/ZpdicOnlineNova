//

import rison from "rison";
import {
  WordMode,
  WordType
} from "/client/skeleton/dictionary";
import {
  WORD_MODES,
  WordParameter
} from "/client/skeleton/dictionary/word-parameter/word-parameter";


export class AdvancedWordParameter extends WordParameter {

  public elements: Array<AdvancedWordParameterElement>;

  private constructor(elements: Array<AdvancedWordParameterElement>) {
    super();
    this.elements = elements;
  }

  public static createEmpty(): AdvancedWordParameter {
    const elements = [AdvancedWordParameterElement.createEmpty()];
    const skeleton = new AdvancedWordParameter(elements);
    return skeleton;
  }

  public static deserializeEach(search: Record<string, unknown>): AdvancedWordParameter {
    if (typeof search.advanced === "string") {
      const data = rison.decode<any>(search.advanced);
      const parameter = new AdvancedWordParameter(data.elements);
      return parameter;
    } else {
      const parameter = new AdvancedWordParameter([]);
      return parameter;
    }
  }

  public serialize(): Record<string, unknown> {
    const search = {advanced: encodeURI(rison.encode(this))};
    return search;
  }

}


export class AdvancedWordParameterElement {

  public text!: string;
  public title!: string;
  public mode!: AdvancedWordMode;
  public type!: WordType;

  public static createEmpty(): AdvancedWordParameterElement {
    const text = "";
    const title = "";
    const mode = "name" as const;
    const type = "exact" as const;
    const skeleton = {text, title, mode, type};
    return skeleton;
  }

}


export const ADVANCED_WORD_MODES = WORD_MODES.filter((mode) => mode !== "both") as Array<AdvancedWordMode>;
export type AdvancedWordMode = Exclude<WordMode, "both">;