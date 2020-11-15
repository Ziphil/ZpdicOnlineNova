//


export class Equivalent {

  public title!: string;
  public names!: Array<string>;

  public static createEmpty(): Equivalent {
    let title = "";
    let names = new Array<string>();
    let skeleton = {title, names};
    return skeleton;
  }

}