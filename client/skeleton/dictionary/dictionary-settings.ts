//

import {
  Skeleton
} from "/client/skeleton/skeleton";


export class DictionarySettings extends Skeleton {

  public akrantiainSource?: string;
  public zatlinSource?: string;
  public punctuations!: Array<string>;
  public pronunciationTitle!: string;
  public enableMarkdown!: boolean;

}