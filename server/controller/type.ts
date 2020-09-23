//

import {
  ValueOf
} from "ts-essentials";
import {
  DetailedDictionary,
  Dictionary,
  EditWord,
  Suggestion,
  UserDictionary,
  Word
} from "/server/skeleton/dictionary";
import {
  CustomError
} from "/server/skeleton/error";
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


export const SERVER_PATH = {
  createDictionary: "/api/dictionary/create",
  uploadDictionary: "/api/dictionary/upload",
  deleteDictionary: "/api/dictionary/delete",
  changeDictionaryName: "/api/dictionary/edit/name",
  changeDictionaryParamName: "/api/dictionary/edit/paramname",
  changeDictionarySecret: "/api/dictionary/edit/secret",
  changeDictionaryExplanation: "/api/dictionary/edit/explanation",
  inviteEditDictionary: "/api/dictionary/invite",
  respondEditDictionary: "/api/dictionary/invite/respond",
  deleteDictionaryAuthorizedUser: "/api/dictionary/user/delete",
  editWord: "/api/word/edit",
  deleteWord: "/api/word/delete",
  searchDictionary: "/api/dictionary/search",
  downloadDictionary: "/api/dictionary/download",
  fetchDictionary: "/api/dictionary/info",
  suggestDictionaryTitles: "/api/dictionary/title",
  fetchDictionaryAuthorizedUsers: "/api/dictionary/user",
  fetchWholeDictionary: "/api/dictionary/whole",
  fetchDictionaries: "/api/dictionary/list",
  fetchAllDictionaries: "/api/dictionary/list/all",
  fetchDictionaryAggregation: "/api/dictionary/aggregate",
  fetchInvitations: "/api/dictionary/invite/fetch",
  checkDictionaryAuthorization: "/api/dictionary/check",
  login: "/api/user/login",
  logout: "/api/user/logout",
  registerUser: "/api/user/register",
  changeUserScreenName: "/api/user/edit/name",
  changeUserEmail: "/api/user/edit/email",
  changeUserPassword: "/api/user/edit/password",
  issueUserResetToken: "/api/user/reset/token",
  resetUserPassword: "/api/user/reset/reset",
  deleteUser: "/api/user/delete",
  fetchUser: "/api/user/info",
  suggestUsers: "/api/user/suggestion",
  addNotification: "/api/notification/add",
  fetchNotifications: "/api/notification/list",
  contact: "/api/other/contact"
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
  inviteEditDictionary: {
    get: Noop,
    post: {
      request: {number: number, userName: string},
      response: {
        200: Invitation,
        400: CustomError<"noSuchDictionaryNumber" | "noSuchUser" | "userCanAlreadyEdit" | "editDictionaryAlreadyInvited">
      }
    }
  },
  respondEditDictionary: {
    get: Noop,
    post: {
      request: {id: string, accept: boolean},
      response: {
        200: Invitation,
        400: CustomError<"noSuchInvitation">
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
  }
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
      request: {offset?: number, size?: number},
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
        400: CustomError<"duplicateUserName" | "duplicateUserEmail" | "invalidUserName" | "invalidUserEmail" | "invalidUserPassword" | "recaptchaRejected" | "recaptchaError">
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
      request: {name: string, email: string, token: string},
      response: {
        200: null,
        400: CustomError<"noSuchUser" | "recaptchaRejected" | "recaptchaError">
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
        200: Array<Notification>,
        400: never
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
        400: CustomError<"administratorNotFound" | "recaptchaRejected" | "recaptchaError">
      }
    }
  }
};

export type WithRecaptcha<T> = T & {recaptchaToken: string};
export type WithSize<T> = [Array<T>, number];

export type MethodType = "get" | "post";
export type StatusType = 200 | 400;
export type ProcessName = keyof ProcessType;

export type RequestType<N extends ProcessName, M extends MethodType> = ProcessType[N][M]["request"];
export type ResponseType<N extends ProcessName, M extends MethodType> = ValueOf<ProcessType[N][M]["response"]>;
export type ResponseTypeSep<N extends ProcessName, M extends MethodType, S extends StatusType> = ProcessType[N][M]["response"][S];

type Noop = {request: never, response: never};