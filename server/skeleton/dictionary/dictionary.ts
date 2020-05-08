//

import {
  NormalSearchParameter
} from "/server/model/search-parameter";
import {
  Word
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Dictionary extends Skeleton {

  public id!: string;
  public number!: number;
  public paramName?: string;
  public name!: string;
  public status!: string;
  public secret!: boolean;
  public explanation!: string;
  public updatedDate!: string | null;
  public words?: Array<Word>;
  public wordSize?: number;
  public userName?: string;

  public search(parameter: NormalSearchParameter): Array<Word> {
    let search = parameter.search;
    let mode = parameter.mode;
    let type = parameter.type;
    let escapedSearch = search.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    let hitWords = this.words!.filter((word) => {
      let createTargets = function (innerMode: string): Array<string> {
        let targets = [];
        if (innerMode === "name") {
          targets.push(word.name);
        } else if (innerMode === "equivalent") {
          for (let equivalent of word.equivalents) {
            targets.push(...equivalent.names);
          }
        } else if (innerMode === "information") {
          for (let information of word.informations) {
            targets.push(information.text);
          }
        }
        return targets;
      };
      let createNeedle = function (innerType: string): RegExp {
        let needle;
        if (innerType === "exact") {
          needle = new RegExp("^" + escapedSearch + "$");
        } else if (innerType === "prefix") {
          needle = new RegExp("^" + escapedSearch);
        } else if (innerType === "suffix") {
          needle = new RegExp(escapedSearch + "$");
        } else if (innerType === "part") {
          needle = new RegExp(escapedSearch);
        } else if (innerType === "regular") {
          try {
            needle = new RegExp(search);
          } catch (error) {
            needle = /^$/;
          }
        } else {
          needle = /^$/;
        }
        return needle;
      };
      let createPredicate = function (innerMode: string, innerType: string): boolean {
        let targets = createTargets(innerMode);
        let needle = createNeedle(innerType);
        let predicate = targets.some((target) => {
          return !!target.match(needle);
        });
        return predicate;
      };
      let finalPredicate;
      if (mode === "name") {
        finalPredicate = createPredicate("name", type);
      } else if (mode === "equivalent") {
        finalPredicate = createPredicate("equivalent", type);
      } else if (mode === "content") {
        let namePredicate = createPredicate("name", type);
        let equivalentPredicate = createPredicate("equivalent", type);
        let informationPredicate = createPredicate("information", type);
        finalPredicate = namePredicate || equivalentPredicate || informationPredicate;
      } else if (mode === "both") {
        let namePredicate = createPredicate("name", type);
        let equivalentPredicate = createPredicate("equivalent", type);
        finalPredicate = namePredicate || equivalentPredicate;
      } else {
        finalPredicate = false;
      }
      return finalPredicate;
    });
    return hitWords;
  }

}