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
import {
  Skeleton
} from "/client/skeleton/skeleton";


export class AdvancedWordParameter extends WordParameter {

  public elements!: Array<AdvancedWordParameterElement>;

  public static createEmpty(): AdvancedWordParameter {
    let elements = [AdvancedWordParameterElement.createEmpty()];
    let skeleton = AdvancedWordParameter.of({elements});
    return skeleton;
  }

  public static deserializeEach(query: Record<string, unknown>): AdvancedWordParameter {
    if (typeof query["advanced"] === "string") {
      let parameter = AdvancedWordParameter.of(rison.decode(query["advanced"]));
      return parameter;
    } else {
      let parameter = AdvancedWordParameter.of({elements: []});
      return parameter;
    }
  }

  public serialize(): string {
    let queryString = "advanced=" + encodeURI(rison.encode(this));
    return queryString;
  }

}


export class AdvancedWordParameterElement extends Skeleton {

  public search!: string;
  public title!: string;
  public mode!: AdvancedWordMode;
  public type!: WordType;

  public static createEmpty(): AdvancedWordParameterElement {
    let search = "";
    let title = "";
    let mode = "name" as const;
    let type = "exact" as const;
    let skeleton = AdvancedWordParameterElement.of({search, title, mode, type});
    return skeleton;
  }

}


export const ADVANCED_WORD_MODES = WORD_MODES.filter((mode) => mode !== "both") as Array<AdvancedWordMode>;
export type AdvancedWordMode = Exclude<WordMode, "both">;