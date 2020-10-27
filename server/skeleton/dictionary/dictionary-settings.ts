//

import {
  Skeleton
} from "/server/skeleton/skeleton";


export class DictionarySettings extends Skeleton {

  public akrantiainSource?: string;
  public zatlinSource?: string;
  public punctuations!: Array<string>;
  public pronunciationTitle!: string;
  public enableMarkdown!: boolean;

}