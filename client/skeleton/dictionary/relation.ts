//


export class Relation {

  public titles!: Array<string>;
  public number!: number;
  public name!: string;

  public static createEmpty(): Relation {
    const titles = [] as Array<string>;
    const number = -1;
    const name = "";
    const skeleton = {titles, number, name};
    return skeleton;
  }

}