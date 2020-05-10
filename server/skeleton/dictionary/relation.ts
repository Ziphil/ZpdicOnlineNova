//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class Relation extends Skeleton {

  public title!: string;
  public number!: number;
  public name!: string;

  public static empty(): Relation {
    let title = "";
    let number = -1;
    let name = "";
    let skeleton = Relation.of({title, number, name});
    return skeleton;
  }

}