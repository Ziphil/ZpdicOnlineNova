//

import {
  DocumentType
} from "@hasezoey/typegoose";
import {
  NormalSearchParameter
} from "/server/model/dictionary/search-parameter";


export abstract class Dictionary<W> {

  public abstract search(parameter: NormalSearchParameter, offset?: number, size?: number): Promise<Array<DocumentType<W>>>;

}