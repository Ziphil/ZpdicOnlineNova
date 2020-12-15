//


export class LinkedWord {

  public number!: number;
  public name?: string;

  public static createEmpty(): LinkedWord {
    let number = -1;
    let name = "";
    let skeleton = {number, name};
    return skeleton;
  }

}