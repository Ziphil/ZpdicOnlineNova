//


export class Relation {

  public title!: string;
  public number!: number;
  public name!: string;

  public static createEmpty(): Relation {
    const title = "";
    const number = -1;
    const name = "";
    const skeleton = {title, number, name};
    return skeleton;
  }

}