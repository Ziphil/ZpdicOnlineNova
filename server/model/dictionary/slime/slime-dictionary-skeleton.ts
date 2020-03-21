//

import {
  NormalSearchParameter
} from "/server/model/dictionary/search-parameter";
import {
  SlimeWordSkeleton
} from "/server/model/dictionary/slime";


export class SlimeDictionarySkeleton {

  public id!: string;
  public number!: number;
  public status!: string;
  public secret!: boolean;
  public name!: string;
  public words?: Array<SlimeWordSkeleton>;
  public wordSize?: number;

  public constructor(object: Fields<SlimeDictionarySkeleton>) {
    Object.assign(this, object);
  }

  public search(parameter: NormalSearchParameter): Array<SlimeWordSkeleton> {
    let hitWords = this.words!.filter((word) => {
      let search = parameter.search;
      let mode = parameter.mode;
      let type = parameter.type;
      let escapedSearch = search.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
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
          needle = new RegExp(search);
        } else {
          needle = /^$/;
        }
        return needle;
      };
      let createPredicate = function (innerMode: string, innerType: string): boolean {
        let targets = createTargets(innerMode);
        let needle = createNeedle(innerType);
        let result = targets.some((target) => {
          return !!target.match(needle);
        });
        return result;
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


type ExtractRequired<T, P extends keyof T> = undefined extends T[P] ? never : P;
type ExtractOptional<T, P extends keyof T> = undefined extends T[P] ? P : never;
type RequiredFieldNames<T> = {[P in keyof T]: T[P] extends (...args: Array<any>) => any ? never : ExtractRequired<T, P>}[keyof T];
type OptionalFieldNames<T> = {[P in keyof T]: T[P] extends (...args: Array<any>) => any ? never : ExtractOptional<T, P>}[keyof T];

type Fields<T> = {[P in RequiredFieldNames<T>]: T[P]} & {[P in OptionalFieldNames<T>]?: T[P]};