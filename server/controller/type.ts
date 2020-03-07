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
  dictionaryListAll: "/api/dictionary/list/all",
  dictionaryUpload: "/api/dictionary/upload",
  userInfo: "/api/user/info",
  userLogin: "/api/user/login",
  userRegister: "/api/user/register"
};

export type ResponseType = {
  dictionaryCreate: {
    get: never,
    post: SlimeDictionarySkeleton
  },
  dictionarySearch: {
    get: MayError<Array<SlimeWordSkeleton>>,
    post: never
  },
  dictionaryInfo: {
    get: MayError<SlimeDictionarySkeleton>,
    post: never
  },
  dictionaryList: {
    get: Array<SlimeDictionarySkeleton>,
    post: never
  },
  dictionaryListAll: {
    get: Array<SlimeDictionarySkeleton>,
    post: never
  }
  dictionaryUpload: {
    get: never,
    post: SlimeDictionarySkeleton
  },
  userInfo: {
    get: UserSkeleton,
    post: never
  },
  userLogin: {
    get: never,
    post: MayError<UserSkeleton & {token: string}>
  }
  userRegister: {
    get: never,
    post: MayError<UserSkeleton>
  }
};

export type RequestType = {
  dictionaryCreate: {
    get: never,
    post: Required<"name">
  },
  dictionarySearch: {
    get: Required<"number" | "search" | "mode" | "type" | "offset" | "size">,
    post: never
  },
  dictionaryInfo: {
    get: Required<"number">,
    post: never
  },
  dictionaryList: {
    get: {},
    post: never
  },
  dictionaryListAll: {
    get: {},
    post: never
  }
  dictionaryUpload: {
    get: never,
    post: Required<"number">
  },
  userInfo: {
    get: {},
    post: never
  },
  userLogin: {
    get: never,
    post: Required<"name" | "password">
  }
  userRegister: {
    get: never,
    post: Required<"name" | "email" | "password">
  }
};

export type MethodType = "get" | "post";
export type ProcessName = keyof ResponseType & keyof RequestType;

type Required<S extends string> = {[N in S]: string};
type Optional<S extends string> = {[N in S]?: string};