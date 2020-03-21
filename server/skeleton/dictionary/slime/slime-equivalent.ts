//

import {
  SlimeEquivalent
} from "/server/model/dictionary/slime";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class SlimeEquivalentSkeleton extends Skeleton {

  public title!: string;
  public names!: Array<string>;

  public static from(raw: SlimeEquivalent): SlimeEquivalentSkeleton {
    let title = raw.title;
    let names = raw.names;
    let skeleton = SlimeEquivalentSkeleton.of({title, names});
    return skeleton;
  }

}