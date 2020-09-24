//

import {
  Equivalent,
  Information,
  Relation,
  Variation
} from "/server/skeleton/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class EditWord extends Skeleton {

  public number?: number;
  public name!: string;
  public equivalents!: Array<Equivalent>;
  public tags!: Array<string>;
  public informations!: Array<Information>;
  public variations!: Array<Variation>;
  public relations!: Array<Relation>;

  public static empty(): EditWord {
    let name = "";
    let equivalents = new Array<Equivalent>();
    let tags = new Array<string>();
    let informations = new Array<Information>();
    let variations = new Array<Variation>();
    let relations = new Array<Relation>();
    let skeleton = EditWord.of({name, equivalents, tags, informations, variations, relations});
    return skeleton;
  }

}


export class Word extends EditWord {

  public id!: string;
  public number!: number;
  public createdDate?: string;
  public updatedDate?: string;

}