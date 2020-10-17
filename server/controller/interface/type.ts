//

import {
  ValueOf
} from "ts-essentials";
import {
  Commission
} from "/server/skeleton/commission";
import {
  DetailedDictionary,
  Dictionary,
  DictionarySettings,
  EditWord,
  Suggestion,
  UserDictionary,
  Word
} from "/server/skeleton/dictionary";
import {
  CustomError
} from "/server/skeleton/error";
import {
  History
} from "/server/skeleton/history";
import {
  Invitation
} from "/server/skeleton/invitation";
import {
  Notification
} from "/server/skeleton/notification";
import {
  DetailedUser,
  User
} from "/server/skeleton/user";


export const SERVER_PATH_PREFIX = "/internal/" + process.env["npm_package_version"];
export const SERVER_PATHS = {
  createDictionary: "/dictionary/create",
  uploadDictionary: "/dictionary/upload",
  deleteDictionary: "/dictionary/delete",
  changeDictionaryName: "/dictionary/edit/name",
  changeDictionaryParamName: "/dictionary/edit/param-name",
  changeDictionarySecret: "/dictionary/edit/secret",
  changeDictionaryExplanation: "/dictionary/edit/explanation",
  changeDictionarySnoj: "/dictionary/edit/snoj",
  changeDictionarySettings: "/dictionary/edit/settings",
  deleteDictionaryAuthorizedUser: "/dictionary/user/delete",
  addInvitation: "/invitation/add",
  respondInvitation: "/invitation/respond",
  editWord: "/word/edit",
  deleteWord: "/word/delete",
  addCommission: "/request/add",
  deleteCommission: "/request/delete",
  searchDictionary: "/dictionary/search",
  downloadDictionary: "/dictionary/download",
  fetchDictionary: "/dictionary/info",
  suggestDictionaryTitles: "/dictionary/suggest/title",
  fetchDictionaryAuthorizedUsers: "/dictionary/user",
  fetchWholeDictionary: "/dictionary/whole",
  fetchDictionaries: "/dictionary/list",
  fetchAllDictionaries: "/dictionary/list/all",
  fetchDictionaryAggregation: "/dictionary/aggregate",
  fetchInvitations: "/invitation/fetch",
  checkDictionaryAuthorization: "/dictionary/check",
  fetchCommissions: "/request/fetch",
  login: "/user/login",
  logout: "/user/logout",
  registerUser: "/user/register",
  changeUserScreenName: "/user/edit/name",
  changeUserEmail: "/user/edit/email",
  changeUserPassword: "/user/edit/password",
  issueUserResetToken: "/user/reset/token",
  resetUserPassword: "/user/reset/reset",
  deleteUser: "/user/delete",
  fetchUser: "/user/info",
  suggestUsers: "/user/suggestion",
  addNotification: "/notification/add",
  fetchNotifications: "/notification/list",
  fetchHistories: "/history/fetch",
  contact: "/other/contact"
};

type ProcessData = {
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
        200: null,
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
  changeDictionarySnoj: {
    get: Noop,
    post: {
      request: {number: number, snoj: string},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  changeDictionarySettings: {
    get: Noop,
    post: {
      request: {number: number, settings: Partial<DictionarySettings>},
      response: {
        200: Dictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    }
  },
  deleteDictionaryAuthorizedUser: {
    get: Noop,
    post: {
      request: {number: number, id: string},
      response: {
        200: null,
        400: CustomError<"noSuchDictionaryNumber" | "noSuchDictionaryAuthorizedUser">
      }
    }
  },
  addInvitation: {
    get: Noop,
    post: {
      request: {number: number, type: string, userName: string},
      response: {
        200: Invitation,
        400: CustomError<"noSuchDictionaryNumber" | "noSuchUser" | "userCanAlreadyEdit" | "userCanAlreadyOwn" | "editInvitationAlreadyAdded" | "transferInvitationAlreadyAdded">
      }
    }
  },
  respondInvitation: {
    get: Noop,
    post: {
      request: {id: string, accept: boolean},
      response: {
        200: Invitation,
        400: CustomError<"noSuchInvitation">
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
  addCommission: {
    get: Noop,
    post: {
      request: WithRecaptcha<{number: number, name: string, comment?: string}>,
      response: {
        200: Commission,
        400: CustomError<"noSuchDictionaryNumber" | "emptyCommissionName">
      }
    }
  },
  deleteCommission: {
    get: Noop,
    post: {
      request: {number: number, id: string},
      response: {
        200: Commission,
        400: CustomError<"noSuchDictionaryNumber" | "noSuchCommission">
      }
    }
  }
  searchDictionary: {
    get: {
      request: {number: number, search: string, mode: string, type: string, offset?: number, size?: number},
      response: {
        200: {words: WithSize<Word>, suggestions: Array<Suggestion>},
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
  suggestDictionaryTitles: {
    get: {
      request: {number: number, propertyName: string, pattern: string},
      response: {
        200: Array<string>,
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  },
  fetchDictionaryAuthorizedUsers: {
    get: {
      request: {number: number, authority: string},
      response: {
        200: Array<User>,
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  },
  fetchWholeDictionary: {
    get: {
      request: {number: number},
      response: {
        200: DetailedDictionary,
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  }
  fetchDictionaries: {
    get: {
      request: {},
      response: {
        200: Array<UserDictionary>,
        400: never
      }
    },
    post: Noop
  },
  fetchAllDictionaries: {
    get: {
      request: {order: string, offset?: number, size?: number},
      response: {
        200: WithSize<DetailedDictionary>,
        400: never
      }
    },
    post: Noop
  },
  fetchDictionaryAggregation: {
    get: {
      request: {},
      response: {
        200: {dictionaryCount: number, wordCount: number, dictionarySize: number, wordSize: number},
        400: never
      }
    },
    post: Noop
  },
  fetchInvitations: {
    get: {
      request: {type: string},
      response: {
        200: Array<Invitation>,
        400: never
      }
    },
    post: Noop
  },
  checkDictionaryAuthorization: {
    get: {
      request: {number: number, authority: string},
      response: {
        200: null,
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  },
  fetchCommissions: {
    get: {
      request: {number: number, offset?: number, size?: number},
      response: {
        200: WithSize<Commission>,
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
        200: {token: string, user: DetailedUser},
        400: never
      }
    }
  },
  logout: {
    get: Noop,
    post: {
      request: {},
      response: {
        200: null,
        400: never
      }
    }
  },
  registerUser: {
    get: Noop,
    post: {
      request: WithRecaptcha<{name: string, email: string, password: string}>,
      response: {
        200: User,
        400: CustomError<"duplicateUserName" | "duplicateUserEmail" | "invalidUserName" | "invalidUserEmail" | "invalidUserPassword">
      }
    }
  },
  changeUserScreenName: {
    get: Noop,
    post: {
      request: {screenName: string},
      response: {
        200: User,
        400: never
      }
    }
  },
  changeUserEmail: {
    get: Noop,
    post: {
      request: {email: string},
      response: {
        200: User,
        400: CustomError<"duplicateUserEmail" | "invalidUserEmail">
      }
    }
  },
  changeUserPassword: {
    get: Noop,
    post: {
      request: {password: string},
      response: {
        200: User,
        400: CustomError<"invalidUserPassword">
      }
    }
  },
  issueUserResetToken: {
    get: Noop,
    post: {
      request: WithRecaptcha<{name: string, email: string}>,
      response: {
        200: null,
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
        400: CustomError<"invalidResetToken" | "invalidUserPassword">
      }
    }
  },
  deleteUser: {
    get: Noop,
    post: {
      request: {},
      response: {
        200: null,
        400: never
      }
    }
  },
  fetchUser: {
    get: {
      request: {},
      response: {
        200: DetailedUser,
        400: never
      }
    },
    post: Noop
  },
  suggestUsers: {
    get: {
      request: {pattern: string},
      response: {
        200: Array<User>,
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
        200: WithSize<Notification>,
        400: never
      }
    },
    post: Noop
  },
  fetchHistories: {
    get: {
      request: {number: number, from: string},
      response: {
        200: Array<History>,
        400: CustomError<"noSuchDictionaryNumber">
      }
    },
    post: Noop
  },
  contact: {
    get: Noop,
    post: {
      request: WithRecaptcha<{name: string, email: string, subject: string, text: string}>,
      response: {
        200: null,
        400: CustomError<"emptyContactText" | "administratorNotFound">
      }
    }
  }
};

export type WithRecaptcha<T> = T & {recaptchaToken: string};
export type WithSize<T> = [Array<T>, number];

export type Method = "get" | "post";
export type Status = 200 | 400;
export type ProcessName = keyof ProcessData;

export type RequestData<N extends ProcessName, M extends Method> = ProcessData[N][M]["request"];
export type ResponseData<N extends ProcessName, M extends Method> = ValueOf<ProcessData[N][M]["response"]>;
export type ResponseDataSep<N extends ProcessName, M extends Method, S extends Status> = ProcessData[N][M]["response"][S];

type Noop = {request: never, response: never};