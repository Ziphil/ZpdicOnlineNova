//

import {
  SlimeWordDocument
} from "/server/model/dictionary/slime";
import {
  SlimeEquivalentSkeleton,
  SlimeInformationSkeleton,
  SlimeRelationSkeleton,
  SlimeVariationSkeleton
} from "/server/skeleton/dictionary/slime";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class SlimeEditWordSkeleton extends Skeleton {

  public number?: number;
  public name!: string;
  public equivalents!: Array<SlimeEquivalentSkeleton>;
  public tags!: Array<string>;
  public informations!: Array<SlimeInformationSkeleton>;
  public variations!: Array<SlimeVariationSkeleton>;
  public relations!: Array<SlimeRelationSkeleton>;

  public static empty(): SlimeEditWordSkeleton {
    let name = "";
    let equivalents = new Array<SlimeEquivalentSkeleton>();
    let tags = new Array<string>();
    let informations = new Array<SlimeInformationSkeleton>();
    let variations = new Array<SlimeVariationSkeleton>();
    let relations = new Array<SlimeRelationSkeleton>();
    let skeleton = SlimeEditWordSkeleton.of({name, equivalents, tags, informations, variations, relations});
    return skeleton;
  }

}


export class SlimeWordSkeleton extends SlimeEditWordSkeleton {

  public id!: string;
  public number!: number;

  public static from(raw: SlimeWordDocument): SlimeWordSkeleton {
    let id = raw.id;
    let number = raw.number;
    let name = raw.name;
    let equivalents = raw.equivalents.map(SlimeEquivalentSkeleton.from);
    let tags = raw.tags;
    let informations = raw.informations.map(SlimeInformationSkeleton.from);
    let variations = raw.variations.map(SlimeVariationSkeleton.from);
    let relations = raw.relations.map(SlimeRelationSkeleton.from);
    let skeleton = SlimeWordSkeleton.of({id, number, name, equivalents, tags, informations, variations, relations});
    return skeleton;
  }

}