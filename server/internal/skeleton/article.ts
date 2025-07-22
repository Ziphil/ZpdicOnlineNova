//

import {DateString, ObjectId} from "/server/internal/skeleton/common";


export interface EditableArticle {

  number: number | null;
  tags: Array<string>;
  title: string;
  content: string;

}


export interface Article {

  id: ObjectId;
  number: number;
  tags: Array<string>;
  title: string;
  content: string;
  createdDate?: DateString;
  updatedDate?: DateString;

}