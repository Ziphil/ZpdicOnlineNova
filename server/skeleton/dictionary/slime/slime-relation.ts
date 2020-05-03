//

import {
  SlimeRelation
} from "/server/model/dictionary/slime";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class SlimeRelationSkeleton extends Skeleton {

  public title!: string;
  public number!: number;
  public name!: string;

  public static from(raw: SlimeRelation): SlimeRelationSkeleton {
    let title = raw.title;
    let number = raw.number;
    let name = raw.name;
    let skeleton = SlimeRelationSkeleton.of({title, number, name});
    return skeleton;
  }

  public static empty(): SlimeRelationSkeleton {
    let title = "";
    let number = -1;
    let name = "";
    let skeleton = SlimeRelationSkeleton.of({title, number, name});
    return skeleton;
  }

}