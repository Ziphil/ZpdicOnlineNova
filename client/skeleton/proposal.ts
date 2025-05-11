import {DateString, ObjectId} from "/client/skeleton/common";


export interface Proposal {

  id: ObjectId;
  name: string;
  comment?: string;
  createdDate: DateString;

}