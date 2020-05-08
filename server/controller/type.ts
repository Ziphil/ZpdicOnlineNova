//

import {
  Dictionary,
  EditWord,
  Word
} from "/server/skeleton/dictionary";
import {
  CustomError
} from "/server/skeleton/error";
import {
  Notification
} from "/server/skeleton/notification";
import {
  User
} from "/server/skeleton/user";


export const SERVER_PATH = {
  createDictionary: "/api/dictionary/create",
  uploadDictionary: "/api/dictionary/upload",
  deleteDictionary: "/api/dictionary/delete",
  changeDictionaryName: "/api/dictionary/edit/name",
  changeDictionaryParamName: "/api/dictionary/edit/paramname",
  changeDictionarySecret: "/api/dictionary/edit/secret",
  changeDictionaryExplanation: "/api/dictionary/edit/explanation",
  editWord: "/api/word/edit",
  deleteWord: "/api/word/delete",
  searchDictionary: "/api/dictionary/search",
  downloadDictionary: "/api/dictionary/download",
  fetchDictionary: "/api/dictionary/info",
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
  issueUserResetToken: "/api/user/reset/token",
  resetUserPassword: "/api/user/reset/reset",
  fetchUser: "/api/user/info",
  addNotification: "/api/news/add",
  fetchNotifications: "/api/news/list"
};

type ProcessType = {
  createDictionary: {
    get: Noop,
    post: {
      request: {name: string},
      response: {
        200: Dictionary,
        400: never
      }
    }
  },
  uploadDictionary: {
    get: Noop,
    post: {
      request: {number: number},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  deleteDictionary: {
    get: Noop,
    post: {
      request: {number: number},
      response: {
        200: {},
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  changeDictionaryName: {
    get: Noop,
    post: {
      request: {number: number, name: string},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  changeDictionaryParamName: {
    get: Noop,
    post: {
      request: {number: number, paramName: string},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber" | "duplicateDictionaryParamName" | "invalidDictionaryParamName">
      }
    }
  },
  changeDictionarySecret: {
    get: Noop,
    post: {
      request: {number: number, secret: boolean},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  changeDictionaryExplanation: {
    get: Noop,
    post: {
      request: {number: number, explanation: string},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  editWord: {
    get: Noop,
    post: {
      request: {number: number, word: EditWord},
      response: {
        200: Word,
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  deleteWord: {
    get: Noop,
    post: {
      request: {number: number, wordNumber: number},
      response: {
        200: Word,
        400: CustomError<"noSuchDictionaryNumber" | "noSuchWordNumber">
      }
    }
  },
  searchDictionary: {
    get: {
      request: {number: number, search: string, mode: string, type: string, offset?: number, size?: number},
      response: {
        200: {hitSize: number, hitWords: Array<Word>},
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  },
  downloadDictionary: {
    get: {
      request: {number: number, fileName?: string},
      response: {
        200: never,
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  },
  fetchDictionary: {
    get: {
      request: {number?: number, paramName?: string},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber" | "noSuchDictionaryParamName" | "invalidArgument">
      }
    },
    post: Noop
  },
  fetchWholeDictionary: {
    get: {
      request: {number: number},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  }
  fetchDictionaries: {
    get: {
      request: {},
      response: {
        200: Array<Dictionary>,
        400: never
      }
    },
    post: Noop
  },
  fetchAllDictionaries: {
    get: {
      request: {},
      response: {
        200: Array<Dictionary>,
        400: never
      }
    },
    post: Noop
  },
  fetchDictionaryAggregation: {
    get: {
      request: {},
      response: {
        200: {dictionarySize: number, wordSize: number},
        400: never
      }
    },
    post: Noop
  },
  checkDictionaryAuthorization: {
    get: {
      request: {number: number},
      response: {
        200: {},
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  },
  login: {
    get: Noop,
    post: {
      request: {name: string, password: string},
      response: {
        200: {token: string, user: User},
        400: never
      }
    }
  },
  logout: {
    get: Noop,
    post: {
      request: {},
      response: {
        200: {},
        400: never
      }
    }
  },
  registerUser: {
    get: Noop,
    post: {
      request: {name: string, email: string, password: string},
      response: {
        200: User,
        400: CustomError<"duplicateUserName" | "duplicateUserEmail" | "invalidUserName" | "invalidEmail" | "invalidPassword">
      }
    }
  },
  changeUserEmail: {
    get: Noop,
    post: {
      request: {email: string},
      response: {
        200: User,
        400: CustomError<"duplicateUserEmail" | "invalidEmail">
      }
    }
  },
  changeUserPassword: {
    get: Noop,
    post: {
      request: {password: string},
      response: {
        200: User,
        400: CustomError<"invalidPassword">
      }
    }
  },
  issueUserResetToken: {
    get: Noop,
    post: {
      request: {name: string, email: string},
      response: {
        200: {},
        400: CustomError<"noSuchUser">
      }
    }
  },
  resetUserPassword: {
    get: Noop,
    post: {
      request: {key: string, password: string},
      response: {
        200: User,
        400: CustomError<"invalidResetToken" | "invalidPassword">
      }
    }
  },
  fetchUser: {
    get: {
      request: {},
      response: {
        200: User,
        400: never
      }
    },
    post: Noop
  },
  addNotification: {
    get: Noop,
    post: {
      request: {type: string, title: string, text: string},
      response: {
        200: Notification,
        400: never
      }
    }
  },
  fetchNotifications: {
    get: {
      request: {offset?: number, size?: number},
      response: {
        200: Array<Notification>,
        400: never
      }
    },
    post: Noop
  }
};

export type MethodType = "get" | "post";
export type ProcessName = keyof ProcessType;

export type RequestType<N extends ProcessName, M extends MethodType> = ProcessType[N][M]["request"];
export type ResponseType<N extends ProcessName, M extends MethodType> = ValueOf<ProcessType[N][M]["response"]>;

type Noop = {request: never, response: never};
type ValueOf<T> = T[keyof T];