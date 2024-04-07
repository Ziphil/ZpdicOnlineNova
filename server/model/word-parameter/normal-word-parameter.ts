//

import {Aggregate} from "mongoose";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {Word, WordModel} from "/server/model/word/word";
import {RawSuggestion, WordIgnoreOptions, WordMode, WordOrder, WordParameter, WordType} from "/server/model/word-parameter/word-parameter";
import {QueryLike} from "/server/util/query";
import {Random} from "/server/util/random";


export class NormalWordParameter extends WordParameter {

  public readonly kind: "normal";
  public text: string;
  public mode: WordMode;
  public type: WordType;
  public order: WordOrder;
  public options: NormalWordParameterOptions;

  public constructor(text: string, mode: WordMode, type: WordType, order: WordOrder, options: NormalWordParameterOptions) {
    super();
    this.kind = "normal";
    this.text = text;
    this.mode = mode;
    this.type = type;
    this.order = order;
    this.options = options;
  }

  public createQuery(dictionary: Dictionary): QueryLike<Array<Word>, Word> {
    const keys = WordParameter.createKeys(this.mode);
    const needle = WordParameter.createNeedle(this.text, this.type, this.options.ignore);
    const sortKey = WordParameter.createSortKey(this.order);
    const disjunctFilters = keys.map((key) => WordModel.find().where(key, needle).getFilter());
    const query = WordModel.findExist().where("dictionary", dictionary).or(disjunctFilters).sort(sortKey);
    if (this.options.shuffleSeed !== null) {
      const random = new Random(this.options.shuffleSeed);
      const promise = query.then((words) => {
        random.shuffle(words);
        return words;
      });
      return promise;
    } else {
      return query;
    }
  }

  public createSuggestionQuery(dictionary: Dictionary): Aggregate<Array<RawSuggestion>> | null {
    if (this.options.enableSuggestions) {
      const mode = this.mode;
      const type = this.type;
      if ((mode === "name" || mode === "both") && (type === "exact" || type === "prefix")) {
        const needle = WordParameter.createNeedle(this.text, "exact", {case: false});
        let aggregate = WordModel.aggregate();
        aggregate = aggregate.match(WordModel.findExist().where("dictionary", dictionary["_id"]).where("variations.name", needle).getFilter());
        aggregate = aggregate.addFields({oldVariations: "$variations"});
        aggregate = aggregate.unwind("$oldVariations");
        aggregate = aggregate.match(WordModel.where("oldVariations.name", needle).getFilter());
        aggregate = aggregate.project({title: "$oldVariations.title", word: "$$CURRENT"});
        return aggregate;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

}


export type NormalWordParameterOptions = {
  ignore: WordIgnoreOptions,
  shuffleSeed: string | null,
  enableSuggestions: boolean
};