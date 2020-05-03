//

import {
  NormalSearchParameter
} from "/server/model/dictionary/search-parameter";
import {
  SlimeDictionaryDocument
} from "/server/model/dictionary/slime";
import {
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class SlimeDictionarySkeleton extends Skeleton {

  public id!: string;
  public number!: number;
  public paramName?: string;
  public name!: string;
  public status!: string;
  public secret!: boolean;
  public explanation!: string;
  public updatedDate!: string | null;
  public words?: Array<SlimeWordSkeleton>;
  public wordSize?: number;
  public ownerName?: string;

  public static from(raw: SlimeDictionaryDocument): SlimeDictionarySkeleton {
    let id = raw.id;
    let number = raw.number;
    let paramName = raw.paramName;
    let name = raw.name;
    let status = raw.status;
    let secret = raw.secret || false;
    let explanation = raw.explanation || "";
    let updatedDate = raw.updatedDate?.toISOString() || null;
    let skeleton = SlimeDictionarySkeleton.of({id, number, paramName, name, status, secret, explanation, updatedDate});
    return skeleton;
  }

  public static async fromFetch(raw: SlimeDictionaryDocument, whole?: boolean): Promise<SlimeDictionarySkeleton> {
    let skeleton = SlimeDictionarySkeleton.from(raw);
    let wordPromise = new Promise(async (resolve, reject) => {
      try {
        if (whole) {
          let rawWords = await raw.getWords();
          skeleton.words = rawWords.map(SlimeWordSkeleton.from);
          skeleton.wordSize = rawWords.length;
        } else {
          skeleton.wordSize = await raw.countWords();
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    let userPromise = new Promise(async (resolve, reject) => {
      try {
        let owner = await raw.getOwner();
        if (owner) {
          skeleton.ownerName = owner.name;
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    await Promise.all([wordPromise, userPromise]);
    return skeleton;
  }

  public search(parameter: NormalSearchParameter): Array<SlimeWordSkeleton> {
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