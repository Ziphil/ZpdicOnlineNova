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
    const name = "";
    const equivalents = new Array<Equivalent>();
    const tags = new Array<string>();
    const informations = new Array<Information>();
    const variations = new Array<Variation>();
    const relations = new Array<Relation>();
    const skeleton = {name, equivalents, tags, informations, variations, relations};
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