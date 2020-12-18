//

import {
  LinkedWord
} from "/client/skeleton/dictionary";


export class EditableExample {

  public number?: number;
  public words!: Array<LinkedWord>;
  public sentence!: string;
  public translation!: string;

  public static createEmpty(): EditableExample {
    let words = new Array<LinkedWord>();
    let sentence = "";
    let translation = "";
    let skeleton = {words, sentence, translation};
    return skeleton;
  }

}


export class Example extends EditableExample {

  public id!: string;
  public number!: number;

}