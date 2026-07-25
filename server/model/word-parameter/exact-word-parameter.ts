//

import {Aggregate} from "mongoose";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {Word, WordModel} from "/server/model/word/word";
import {RawSuggestion, WordParameter} from "/server/model/word-parameter/word-parameter";
import {QueryLike} from "/server/util/query";


export class ExactWordParameter extends WordParameter {

  public readonly kind: "exact";
  public number: number;

  public constructor(number: number) {
    super();
    this.kind = "exact";
    this.number = number;
  }

  public createQuery(dictionaries: Array<Dictionary>): QueryLike<Array<Word>, Word> {
    const query = WordModel.find().in("dictionary", dictionaries.map((dictionary) => dictionary.id)).where("number", this.number);
    return query;
  }

  public createSuggestionQuery(dictionaries: Array<Dictionary>): Aggregate<Array<RawSuggestion>> | null {
    return null;
  }

}