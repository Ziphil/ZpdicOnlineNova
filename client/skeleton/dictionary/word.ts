//

import {
  Equivalent,
  Example,
  Information,
  Relation,
  Variation
} from "/client/skeleton/dictionary";


export class EditableWord {

  public number?: number;
  public name!: string;
  public pronunciation?: string;
  public equivalents!: Array<Equivalent>;
  public tags!: Array<string>;
  public informations!: Array<Information>;
  public variations!: Array<Variation>;
  public relations!: Array<Relation>;

  public static createEmpty(): EditableWord {
    let name = "";
    let equivalents = new Array<Equivalent>();
    let tags = new Array<string>();
    let informations = new Array<Information>();
    let variations = new Array<Variation>();
    let relations = new Array<Relation>();
    let skeleton = {name, equivalents, tags, informations, variations, relations};
    return skeleton;
  }

}


export class Word extends EditableWord {

  public id!: string;
  public number!: number;
  public createdDate?: string;
  public updatedDate?: string;

}


export class DetailedWord extends Word {

  public examples!: Array<Example>;

}