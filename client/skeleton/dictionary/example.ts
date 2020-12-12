//


export class EditableExample {

  public number?: number;
  public wordNumbers!: Array<number>;
  public sentence!: string;
  public translation!: string;

  public static createEmpty(): EditableExample {
    let wordNumbers = new Array<number>();
    let sentence = "";
    let translation = "";
    let skeleton = {wordNumbers, sentence, translation};
    return skeleton;
  }

}


export class Example extends EditableExample {

  public id!: string;
  public number!: number;

}