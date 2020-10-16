//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Equivalent extends Skeleton {

  public title!: string;
  public names!: Array<string>;

  public static createEmpty(): Equivalent {
    let title = "";
    let names = new Array<string>();
    let skeleton = Equivalent.of({title, names});
    return skeleton;
  }

}