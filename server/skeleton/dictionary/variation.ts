//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Variation extends Skeleton {

  public title!: string;
  public name!: string;

  public static empty(): Variation {
    let title = "";
    let name = "";
    let skeleton = Variation.of({title, name});
    return skeleton;
  }

}