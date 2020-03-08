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
  dictionaryRename: "/api/dictionary/rename",
  dictionaryUpload: "/api/dictionary/upload",
  userInfo: "/api/user/info",
  userLogin: "/api/user/login",
  userRegister: "/api/user/register"
};

export type ProcessType = {
  dictionaryCreate: {
    get: Noop,
    post: {
      request: Required<"name">,
      response: SlimeDictionarySkeleton
    }
  },
  dictionarySearch: {
    get: {
      request: Required<"number" | "search" | "mode" | "type" | "offset" | "size">,
      response: MayError<Array<SlimeWordSkeleton>>
    },
    post: Noop
  },
  dictionaryInfo: {
    get: {
      request: Required<"number">,
      response: MayError<SlimeDictionarySkeleton>
    }
    post: Noop
  },
  dictionaryList: {
    get: {
      request: {},
      response: Array<SlimeDictionarySkeleton>
    },
    post: Noop
  },
  dictionaryListAll: {
    get: {
      request: {},
      response: Array<SlimeDictionarySkeleton>
    }
    post: Noop
  },
  dictionaryRename: {
    get: Noop,
    post: {
      request: Required<"number" | "name">,
      response: SlimeDictionarySkeleton
    }
  },
  dictionaryUpload: {
    get: Noop,
    post: {
      request: Required<"number">,
      response: SlimeDictionarySkeleton
    }
  },
  userInfo: {
    get: {
      request: {},
      response: UserSkeleton
    },
    post: Noop
  },
  userLogin: {
    get: Noop,
    post: {
      request: Required<"name" | "password">,
      response: MayError<UserSkeleton & {token: string}>
    }
  },
  userRegister: {
    get: Noop,
    post: {
      request: Required<"name" | "email" | "password">,
      response: MayError<UserSkeleton>
    }
  }
};

export type MethodType = "get" | "post";
export type ProcessName = keyof ProcessType;

export type RequestType<N extends ProcessName, M extends MethodType> = ProcessType[N][M]["request"];
export type ResponseType<N extends ProcessName, M extends MethodType> = ProcessType[N][M]["response"];

type Noop = {request: never, response: never};
type Required<S extends string> = {[N in S]: string};
type Optional<S extends string> = {[N in S]?: string};