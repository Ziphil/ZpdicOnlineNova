//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class InformationSkeleton extends Skeleton {

  public title!: string;
  public text!: string;

  public static empty(): InformationSkeleton {
    let title = "";
    let text = "";
    let skeleton = InformationSkeleton.of({title, text});
    return skeleton;
  }

}