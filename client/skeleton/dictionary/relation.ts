//


export class Relation {

  public title!: string;
  public number!: number;
  public name!: string;

  public static createEmpty(): Relation {
    let title = "";
    let number = -1;
    let name = "";
    let skeleton = {title, number, name};
    return skeleton;
  }

}