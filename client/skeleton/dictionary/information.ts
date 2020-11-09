//

import {
  Skeleton
} from "/client/skeleton/skeleton";


export class Information extends Skeleton {

  public title!: string;
  public text!: string;

  public static createEmpty(): Information {
    let title = "";
    let text = "";
    let skeleton = Information.of({title, text});
    return skeleton;
  }

}