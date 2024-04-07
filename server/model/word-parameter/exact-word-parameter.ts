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

  public createQuery(dictionary: Dictionary): QueryLike<Array<Word>, Word> {
    const query = WordModel.findExist().where("dictionary", dictionary).where("number", this.number);
    return query;
  }

  public createSuggestionQuery(dictionary: Dictionary): Aggregate<Array<RawSuggestion>> | null {
    return null;
  }

}