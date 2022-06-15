//


export class Information {

  public title!: string;
  public text!: string;

  public static createEmpty(): Information {
    const title = "";
    const text = "";
    const skeleton = {title, text};
    return skeleton;
  }

}