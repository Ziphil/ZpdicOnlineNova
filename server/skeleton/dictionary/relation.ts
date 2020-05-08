//

import {
  Relation
} from "/server/model/dictionary";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class RelationSkeleton extends Skeleton {

  public title!: string;
  public number!: number;
  public name!: string;

  public static from(raw: Relation): RelationSkeleton {
    let title = raw.title;
    let number = raw.number;
    let name = raw.name;
    let skeleton = RelationSkeleton.of({title, number, name});
    return skeleton;
  }

  public static empty(): RelationSkeleton {
    let title = "";
    let number = -1;
    let name = "";
    let skeleton = RelationSkeleton.of({title, number, name});
    return skeleton;
  }

}