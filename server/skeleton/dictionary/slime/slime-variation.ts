//

import {
  SlimeVariation
} from "/server/model/dictionary/slime";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class SlimeVariationSkeleton extends Skeleton {

  public title!: string;
  public name!: string;

  public static from(raw: SlimeVariation): SlimeVariationSkeleton {
    let title = raw.title;
    let name = raw.name;
    let skeleton = SlimeVariationSkeleton.of({title, name});
    return skeleton;
  }

}