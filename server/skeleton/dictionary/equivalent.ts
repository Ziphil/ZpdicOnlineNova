//

import {
  Equivalent
} from "/server/model/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class EquivalentSkeleton extends Skeleton {

  public title!: string;
  public names!: Array<string>;

  public static from(raw: Equivalent): EquivalentSkeleton {
    let title = raw.title;
    let names = raw.names;
    let skeleton = EquivalentSkeleton.of({title, names});
    return skeleton;
  }

  public static empty(): EquivalentSkeleton {
    let title = "";
    let names = new Array<string>();
    let skeleton = EquivalentSkeleton.of({title, names});
    return skeleton;
  }

}