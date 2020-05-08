//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class VariationSkeleton extends Skeleton {

  public title!: string;
  public name!: string;

  public static empty(): VariationSkeleton {
    let title = "";
    let name = "";
    let skeleton = VariationSkeleton.of({title, name});
    return skeleton;
  }

}