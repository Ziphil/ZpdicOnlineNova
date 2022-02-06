//


export class LinkedWord {

  public number!: number;
  public name?: string;

  public static createEmpty(): LinkedWord {
    let number = -1;
    let skeleton = {number};
    return skeleton;
  }

}