//

import {
  SlimeInformation
} from "/server/model/dictionary/slime";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class SlimeInformationSkeleton extends Skeleton {

  public title!: string;
  public text!: string;

  public static from(raw: SlimeInformation): SlimeInformationSkeleton {
    let title = raw.title;
    let text = raw.text;
    let skeleton = SlimeInformationSkeleton.of({title, text});
    return skeleton;
  }

}