//

import {
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/model/dictionary/slime";
import {
  MayError
} from "/server/model/error";
import {
  UserSkeleton
} from "/server/model/user";


export const SERVER_PATH = {
  dictionaryCreate: "/api/dictionary/create",
  dictionarySearch: "/api/dictionary/search",
  dictionaryInfo: "/api/dictionary/info",
  dictionaryList: "/api/dictionary/list",
  dictionaryUpload: "/api/dictionary/upload",
  userInfo: "/api/user/info",
  userLogin: "/api/user/login",
  userRegister: "/api/user/register"
};

export type ResponseBody = {
  dictionaryCreate: SlimeDictionarySkeleton,
  dictionarySearch: MayError<Array<SlimeWordSkeleton>>,
  dictionaryInfo: MayError<SlimeDictionarySkeleton>,
  dictionaryList: Array<SlimeDictionarySkeleton>,
  dictionaryUpload: string,
  userInfo: UserSkeleton,
  userLogin: MayError<UserSkeleton & {token: string}>,
  userRegister: MayError<UserSkeleton>
};

export type RequestQuery = {
  dictionaryCreate: never,
  dictionarySearch: Required<"number" | "search" | "mode" | "type" | "offset" | "size">,
  dictionaryInfo: Required<"number">,
  dictionaryList: {},
  dictionaryUpload: never,
  userInfo: {},
  userLogin: never,
  userRegister: never
};

export type RequestBody = {
  dictionaryCreate: Required<"name">,
  dictionarySearch: never,
  dictionaryInfo: never,
  dictionaryList: never,
  dictionaryUpload: {},
  userInfo: never,
  userLogin: Required<"name" | "password">,
  userRegister: Required<"name" | "email" | "password">;
};

type Required<R extends string> = {[N in R]: string};
type Optional<O extends string> = {[N in O]?: string};