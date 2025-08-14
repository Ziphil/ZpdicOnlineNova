//

import {Query} from "mongoose";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {Word, WordModel} from "/server/model/word/word";
import {WORD_MODES, WordMode, WordParameter, WordType} from "/server/model/word-parameter/word-parameter";


export class AdvancedWordParameter extends WordParameter {

  public readonly kind: "advanced";
  public elements: Array<AdvancedWordParameterElement>;

  public constructor(elements: Array<AdvancedWordParameterElement>) {
    super();
    this.kind = "advanced";
    this.elements = elements;
  }

  public createQuery(dictionary: Dictionary): Query<Array<Word>, Word> {
    const filters = this.elements.map((element) => element.createQuery(dictionary).getFilter());
    const query = WordModel.findExist().and(filters);
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
    const keys = WordParameter.createKeys(this.mode);
    const needle = WordParameter.createNeedle(this.text, this.type, {case: false});
    const eachFilters = keys.map((key) => {
      let eachQuery = WordModel.find().where(key, needle);
      if (this.title) {
        if (this.mode === "term") {
          eachQuery = eachQuery.where("sections.equivalents.titles", this.title);
        } else if (this.mode === "information") {
          eachQuery = eachQuery.where("sections.informations.title", this.title);
        } else if (this.mode === "variation") {
          eachQuery = eachQuery.where("sections.variations.title", this.title);
        } else if (this.mode === "relation") {
          eachQuery = eachQuery.where("sections.relations.titles", this.title);
        }
      }
      const eachFilter = eachQuery.getFilter();
      return eachFilter;
    });
    const query = WordModel.findExist().where("dictionary", dictionary).or(eachFilters);
    return query;
  }

  public createSuggestionQuery(dictionary: Dictionary): null {
    return null;
  }

}


export const ADVANCED_WORD_MODES = WORD_MODES.filter((mode) => mode !== "both") as Array<AdvancedWordMode>;
export type AdvancedWordMode = Exclude<WordMode, "both">;