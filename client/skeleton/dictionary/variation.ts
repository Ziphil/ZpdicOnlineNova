//


export class Variation {

  public title!: string;
  public name!: string;

  public static createEmpty(): Variation {
    const title = "";
    const name = "";
    const skeleton = {title, name};
    return skeleton;
  }

}