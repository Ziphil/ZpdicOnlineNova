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
  createDictionary: "/api/dictionary/create",
  uploadDictionary: "/api/dictionary/upload",
  changeDictionaryName: "/api/dictionary/edit/name",
  changeDictionarySecret: "/api/dictionary/edit/secret",
  searchDictionary: "/api/dictionary/search",
  fetchDictionaryInfo: "/api/dictionary/info",
  fetchDictionaries: "/api/dictionary/list",
  fetchAllDictionaries: "/api/dictionary/list/all",
  login: "/api/user/login",
  registerUser: "/api/user/register",
  changeUserEmail: "/api/user/edit/email",
  changeUserPassword: "/api/user/edit/password",
  fetchUserInfo: "/api/user/info"
};

export type ProcessType = {
  createDictionary: {
    get: Noop,
    post: {
      request: Required<"name">,
      response: SlimeDictionarySkeleton
    }
  },
  uploadDictionary: {
    get: Noop,
    post: {
      request: Required<"number">,
      response: SlimeDictionarySkeleton
    }
  },
  changeDictionaryName: {
    get: Noop,
    post: {
      request: Required<"number" | "name">,
      response: SlimeDictionarySkeleton
    }
  },
  changeDictionarySecret: {
    get: Noop,
    post: {
      request: Required<"number" | "secret">,
      response: SlimeDictionarySkeleton
    }
  }
  searchDictionary: {
    get: {
      request: Required<"number" | "search" | "mode" | "type" | "offset" | "size">,
      response: MayError<Array<SlimeWordSkeleton>>
    },
    post: Noop
  },
  fetchDictionaryInfo: {
    get: {
      request: Required<"number">,
      response: MayError<SlimeDictionarySkeleton>
    }
    post: Noop
  },
  fetchDictionaries: {
    get: {
      request: {},
      response: Array<SlimeDictionarySkeleton>
    },
    post: Noop
  },
  fetchAllDictionaries: {
    get: {
      request: {},
      response: Array<SlimeDictionarySkeleton>
    }
    post: Noop
  },
  login: {
    get: Noop,
    post: {
      request: Required<"name" | "password">,
      response: MayError<UserSkeleton & {token: string}>
    }
  },
  registerUser: {
    get: Noop,
    post: {
      request: Required<"name" | "email" | "password">,
      response: MayError<UserSkeleton>
    }
  },
  changeUserEmail: {
    get: Noop,
    post: {
      request: Required<"email">,
      response: UserSkeleton
    }
  },
  changeUserPassword: {
    get: Noop,
    post: {
      request: Required<"password">,
      response: UserSkeleton
    }
  },
  fetchUserInfo: {
    get: {
      request: {},
      response: UserSkeleton
    },
    post: Noop
  }
};

export type MethodType = "get" | "post";
export type ProcessName = keyof ProcessType;

export type RequestType<N extends ProcessName, M extends MethodType> = ProcessType[N][M]["request"];
export type ResponseType<N extends ProcessName, M extends MethodType> = ProcessType[N][M]["response"];

type Noop = {request: never, response: never};
type Required<S extends string> = {[N in S]: string};
type Optional<S extends string> = {[N in S]?: string};