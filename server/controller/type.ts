//

import {
  SlimeDictionarySkeleton,
  SlimeWordSkeleton
} from "/server/skeleton/dictionary/slime";
import {
  CustomErrorSkeleton
} from "/server/skeleton/error";
import {
  UserSkeleton
} from "/server/skeleton/user";


export const SERVER_PATH = {
  createDictionary: "/api/dictionary/create",
  uploadDictionary: "/api/dictionary/upload",
  deleteDictionary: "/api/dictionary/delete",
  changeDictionaryName: "/api/dictionary/edit/name",
  changeDictionarySecret: "/api/dictionary/edit/secret",
  searchDictionary: "/api/dictionary/search",
  fetchDictionaryInfo: "/api/dictionary/info",
  fetchWholeDictionary: "/api/dictionary/whole",
  fetchDictionaries: "/api/dictionary/list",
  fetchAllDictionaries: "/api/dictionary/list/all",
  fetchDictionaryAggregation: "/api/dictionary/aggregate",
  checkDictionaryAuthorization: "/api/dictionary/check",
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
  deleteDictionary: {
    get: Noop,
    post: {
      request: {number: number},
      response: MayError<boolean>
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
  },
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
    },
    post: Noop
  },
  fetchWholeDictionary: {
    get: {
      request: {number: number},
      response: MayError<SlimeDictionarySkeleton>
    },
    post: Noop
  }
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
    },
    post: Noop
  },
  fetchDictionaryAggregation: {
    get: {
      request: {},
      response: {dictionarySize: number, wordSize: number};
    },
    post: Noop
  },
  checkDictionaryAuthorization: {
    get: {
      request: {number: number},
      response: boolean
    },
    post: Noop
  },
  login: {
    get: Noop,
    post: {
      request: {name: string, password: string},
      response: {token: string, user: UserSkeleton}
    }
  },
  logout: {
    get: Noop,
    post: {
      request: {},
      response: boolean
    }
  },
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
type MayError<T> = T | CustomErrorSkeleton<string>;