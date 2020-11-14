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

  public elements!: Array<AdvancedWordParameterElement>;

  private constructor(elements: Array<AdvancedWordParameterElement>) {
    super();
    this.elements = elements;
  }

  public static createEmpty(): AdvancedWordParameter {
    let elements = [AdvancedWordParameterElement.createEmpty()];
    let skeleton = new AdvancedWordParameter(elements);
    return skeleton;
  }

  public static deserializeEach(query: Record<string, unknown>): AdvancedWordParameter {
    if (typeof query["advanced"] === "string") {
      let data = rison.decode(query["advanced"]) as any;
      let parameter = new AdvancedWordParameter(data.elements);
      return parameter;
    } else {
      let parameter = new AdvancedWordParameter([]);
      return parameter;
    }
  }

  public serialize(): string {
    let queryString = "advanced=" + encodeURI(rison.encode(this));
    return queryString;
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