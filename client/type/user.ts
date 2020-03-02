//

import {
  MayError
} from "/client/type/error";


export type UserLoginSuccessBody = {
  token: string,
  name: string
};
export type UserLoginBody = MayError<UserLoginSuccessBody>;

export type UserBody = {
  name: string,
  email: string
};