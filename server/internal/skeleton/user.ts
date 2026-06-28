//

import {DateString, ObjectId} from "/server/internal/skeleton/common";


export interface User {

  id: ObjectId;
  name: string;
  screenName: string;

}


export interface UserWithDetail extends User {

  email: string;
  activated: boolean;
  termsAgreement: TermsAgreement;

}


export interface TermsAgreement {

  version: number;
  date: DateString;

}


export interface ApiCredential {

  id: ObjectId;
  key?: string;
  createdDate?: DateString;
  lastUsedDate: DateString | null;

}