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
    const words = new Array<LinkedWord>();
    const sentence = "";
    const translation = "";
    const skeleton = {words, sentence, translation};
    return skeleton;
  }

}


export class Example extends EditableExample {

  public id!: string;
  public number!: number;

}