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
  logout: "/api/user/logout",
  registerUser: "/api/user/register",
  changeUserEmail: "/api/user/edit/email",
  changeUserPassword: "/api/user/edit/password",
  fetchUserInfo: "/api/user/info"
};

export type ProcessType = {
  createDictionary: {
    get: Noop,
    post: {
      request: {name: string},
      response: SlimeDictionarySkeleton
    }
  },
  uploadDictionary: {
    get: Noop,
    post: {
      request: {number: number},
      response: SlimeDictionarySkeleton
    }
  },
  changeDictionaryName: {
    get: Noop,
    post: {
      request: {number: number, name: string},
      response: SlimeDictionarySkeleton
    }
  },
  changeDictionarySecret: {
    get: Noop,
    post: {
      request: {number: number, secret: boolean},
      response: SlimeDictionarySkeleton
    }
  }
  searchDictionary: {
    get: {
      request: {number: number, search: string, mode: string, type: string, offset?: number, size?: number},
      response: MayError<Array<SlimeWordSkeleton>>
    },
    post: Noop
  },
  fetchDictionaryInfo: {
    get: {
      request: {number: number},
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
      request: {name: string, password: string},
      response: MayError<UserSkeleton & {token: string}>
    }
  },
  logout: {
    get: Noop,
    post: {
      request: {},
      response: boolean
    }
  }
  registerUser: {
    get: Noop,
    post: {
      request: {name: string, email: string, password: string},
      response: MayError<UserSkeleton>
    }
  },
  changeUserEmail: {
    get: Noop,
    post: {
      request: {email: string},
      response: MayError<UserSkeleton>
    }
  },
  changeUserPassword: {
    get: Noop,
    post: {
      request: {password: string},
      response: MayError<UserSkeleton>
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