//


export class LinkedWord {

  public number!: number;
  public name?: string;

  public static createEmpty(): LinkedWord {
    const number = -1;
    const skeleton = {number};
    return skeleton;
  }

}