//

import {
  Variation
} from "/server/model/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class VariationSkeleton extends Skeleton {

  public title!: string;
  public name!: string;

  public static from(raw: Variation): VariationSkeleton {
    let title = raw.title;
    let name = raw.name;
    let skeleton = VariationSkeleton.of({title, name});
    return skeleton;
  }

  public static empty(): VariationSkeleton {
    let title = "";
    let name = "";
    let skeleton = VariationSkeleton.of({title, name});
    return skeleton;
  }

}