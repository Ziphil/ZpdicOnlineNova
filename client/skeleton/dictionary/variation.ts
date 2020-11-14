//


export class Variation {

  public title!: string;
  public name!: string;

  public static createEmpty(): Variation {
    let title = "";
    let name = "";
    let skeleton = {title, name};
    return skeleton;
  }

}