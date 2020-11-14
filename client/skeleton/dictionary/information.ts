//


export class Information {

  public title!: string;
  public text!: string;

  public static createEmpty(): Information {
    let title = "";
    let text = "";
    let skeleton = {title, text};
    return skeleton;
  }

}