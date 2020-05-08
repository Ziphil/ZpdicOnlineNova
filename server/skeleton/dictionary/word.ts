//

import {
  WordDocument
} from "/server/model/dictionary";
import {
  EquivalentSkeleton,
  InformationSkeleton,
  RelationSkeleton,
  VariationSkeleton
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class EditWordSkeleton extends Skeleton {

  public number?: number;
  public name!: string;
  public equivalents!: Array<EquivalentSkeleton>;
  public tags!: Array<string>;
  public informations!: Array<InformationSkeleton>;
  public variations!: Array<VariationSkeleton>;
  public relations!: Array<RelationSkeleton>;

  public static empty(): EditWordSkeleton {
    let name = "";
    let equivalents = new Array<EquivalentSkeleton>();
    let tags = new Array<string>();
    let informations = new Array<InformationSkeleton>();
    let variations = new Array<VariationSkeleton>();
    let relations = new Array<RelationSkeleton>();
    let skeleton = EditWordSkeleton.of({name, equivalents, tags, informations, variations, relations});
    return skeleton;
  }

}


export class WordSkeleton extends EditWordSkeleton {

  public id!: string;
  public number!: number;

  public static from(raw: WordDocument): WordSkeleton {
    let id = raw.id;
    let number = raw.number;
    let name = raw.name;
    let equivalents = raw.equivalents.map(EquivalentSkeleton.from);
    let tags = raw.tags;
    let informations = raw.informations.map(InformationSkeleton.from);
    let variations = raw.variations.map(VariationSkeleton.from);
    let relations = raw.relations.map(RelationSkeleton.from);
    let skeleton = WordSkeleton.of({id, number, name, equivalents, tags, informations, variations, relations});
    return skeleton;
  }

}