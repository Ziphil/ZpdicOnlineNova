//

import {
  Equivalent,
  Information,
  Relation,
  Variation
} from "/client/skeleton/dictionary";


export class EditWord {

  public number?: number;
  public name!: string;
  public pronunciation?: string;
  public equivalents!: Array<Equivalent>;
  public tags!: Array<string>;
  public informations!: Array<Information>;
  public variations!: Array<Variation>;
  public relations!: Array<Relation>;

  public static createEmpty(): EditWord {
    let name = "";
    let pronunciation;
    let equivalents = new Array<Equivalent>();
    let tags = new Array<string>();
    let informations = new Array<Information>();
    let variations = new Array<Variation>();
    let relations = new Array<Relation>();
    let skeleton = {name, pronunciation, equivalents, tags, informations, variations, relations};
    return skeleton;
  }

}


export class Word extends EditWord {

  public id!: string;
  public number!: number;
  public createdDate?: string;
  public updatedDate?: string;

}