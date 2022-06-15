//


export class Equivalent {

  public title!: string;
  public names!: Array<string>;

  public static createEmpty(): Equivalent {
    const title = "";
    const names = new Array<string>();
    const skeleton = {title, names};
    return skeleton;
  }

}