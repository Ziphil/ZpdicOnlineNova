//

import {DateString, ObjectId} from "/client/skeleton/common";


export interface EditableArticle {

  number: number | null;
  title: string;
  content: string;

}


export interface Article {

  id: ObjectId;
  number: number;
  title: string;
  content: string;
  createdDate?: DateString;
  updatedDate?: DateString;

}