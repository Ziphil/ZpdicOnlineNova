//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class EquivalentSkeleton extends Skeleton {

  public title!: string;
  public names!: Array<string>;

  public static empty(): EquivalentSkeleton {
    let title = "";
    let names = new Array<string>();
    let skeleton = EquivalentSkeleton.of({title, names});
    return skeleton;
  }

}