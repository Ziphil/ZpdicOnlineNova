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
    let elements = [AdvancedWordParameterElement.createEmpty()];
    let skeleton = new AdvancedWordParameter(elements);
    return skeleton;
  }

  public static deserializeEach(searchObject: Record<string, unknown>): AdvancedWordParameter {
    if (typeof searchObject.advanced === "string") {
      let data = rison.decode<any>(searchObject.advanced);
      let parameter = new AdvancedWordParameter(data.elements);
      return parameter;
    } else {
      let parameter = new AdvancedWordParameter([]);
      return parameter;
    }
  }

  public serialize(): Record<string, unknown> {
    let searchObject = {advanced: encodeURI(rison.encode(this))};
    return searchObject;
  }

}


export class AdvancedWordParameterElement {

  public search!: string;
  public title!: string;
  public mode!: AdvancedWordMode;
  public type!: WordType;

  public static createEmpty(): AdvancedWordParameterElement {
    let search = "";
    let title = "";
    let mode = "name" as const;
    let type = "exact" as const;
    let skeleton = {search, title, mode, type};
    return skeleton;
  }

}


export const ADVANCED_WORD_MODES = WORD_MODES.filter((mode) => mode !== "both") as Array<AdvancedWordMode>;
export type AdvancedWordMode = Exclude<WordMode, "both">;