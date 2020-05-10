//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Information extends Skeleton {

  public title!: string;
  public text!: string;

  public static empty(): Information {
    let title = "";
    let text = "";
    let skeleton = Information.of({title, text});
    return skeleton;
  }

}