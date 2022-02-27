//

import {
  Query
} from "mongoose";
import {
  Dictionary,
  Word,
  WordMode,
  WordModel,
  WordType
} from "/server/model/dictionary";
import {
  WORD_MODES,
  WordParameter
} from "/server/model/dictionary/word-parameter/word-parameter";


export class AdvancedWordParameter extends WordParameter {

  public elements: Array<AdvancedWordParameterElement>;

  public constructor(elements: Array<AdvancedWordParameterElement>) {
    super();
    this.elements = elements;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>, Word> {
    let filters = this.elements.map((element) => element.createQuery(dictionary).getFilter());
    let query = WordModel.findExist().and(filters);
    return query;
  }

  public createSuggestionQuery(dictionary: Dictionary): null {
    return null;
  }

}


export class AdvancedWordParameterElement extends WordParameter {

  public text!: string;
  public title!: string;
  public mode!: AdvancedWordMode;
  public type!: WordType;

  public constructor(text: string, title: string, mode: AdvancedWordMode, type: WordType) {
    super();
    this.text = text;
    this.title = title;
    this.mode = mode;
    this.type = type;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>, Word> {
    let keys = WordParameter.createKeys(this.mode);
    let needle = WordParameter.createNeedle(this.text, this.type, {case: false});
    let eachFilters = keys.map((key) => {
      let eachQuery = WordModel.find().where(key, needle);
      if (this.title && (this.mode === "equivalent" || this.mode === "information")) {
        eachQuery = eachQuery.where(`${this.mode}s.title`, this.title);
      }
      let eachFilter = eachQuery.getFilter();
      return eachFilter;
    });
    let query = WordModel.findExist().where("dictionary", dictionary).or(eachFilters);
    return query;
  }

  public createSuggestionQuery(dictionary: Dictionary): null {
    return null;
  }

}


export const ADVANCED_WORD_MODES = WORD_MODES.filter((mode) => mode !== "both") as Array<AdvancedWordMode>;
export type AdvancedWordMode = Exclude<WordMode, "both">;