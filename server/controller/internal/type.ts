//

import {
  Jsonify
} from "jsonify-type";
import {
  Commission
} from "/client/skeleton/commission";
import {
  DetailedDictionary,
  Dictionary,
  DictionarySettings,
  EditableWord,
  Suggestion,
  UserDictionary,
  Word,
  WordParameter
} from "/client/skeleton/dictionary";
import {
  CustomError
} from "/client/skeleton/error";
import {
  History
} from "/client/skeleton/history";
import {
  Invitation,
  InvitationType
} from "/client/skeleton/invitation";
import {
  Notification
} from "/client/skeleton/notification";
import {
  DetailedUser,
  User
} from "/client/skeleton/user";
import {
  DictionaryAuthority,
  DictionaryFullAuthority
} from "/server/model/dictionary";


export const SERVER_PATH_PREFIX = "/internal/" + process.env["npm_package_version"];
export const SERVER_PATHS = {
  createDictionary: "/dictionary/create",
  uploadDictionary: "/dictionary/upload",
  removeDictionary: "/dictionary/remove",
  changeDictionaryName: "/dictionary/edit/name",
  changeDictionaryParamName: "/dictionary/edit/param-name",
  changeDictionarySecret: "/dictionary/edit/secret",
  changeDictionaryExplanation: "/dictionary/edit/explanation",
  changeDictionarySettings: "/dictionary/edit/settings",
  removeDictionaryAuthorizedUser: "/dictionary/user/remove",
  addInvitation: "/invitation/add",
  respondInvitation: "/invitation/respond",
  editWord: "/word/edit",
  removeWord: "/word/remove",
  addCommission: "/commission/add",
  removeCommission: "/commission/remove",
  searchDictionary: "/dictionary/search",
  downloadDictionary: "/dictionary/download",
  fetchDictionary: "/dictionary/fetch",
  suggestDictionaryTitles: "/dictionary/suggest/title",
  fetchDictionaryAuthorizedUsers: "/dictionary/user",
  fetchDictionaries: "/dictionary/list",
  fetchAllDictionaries: "/dictionary/list/all",
  fetchDictionaryAggregation: "/dictionary/aggregate",
  fetchInvitations: "/invitation/fetch",
  checkDictionaryAuthorization: "/dictionary/check",
  fetchCommissions: "/commission/fetch",
  login: "/user/login",
  logout: "/user/logout",
  registerUser: "/user/register",
  changeUserScreenName: "/user/edit/screen-name",
  changeUserEmail: "/user/edit/email",
  changeUserPassword: "/user/edit/password",
  issueUserResetToken: "/user/reset/token",
  resetUserPassword: "/user/reset/reset",
  removeUser: "/user/remove",
  fetchUser: "/user/fetch",
  suggestUsers: "/user/suggest",
  addNotification: "/notification/add",
  fetchNotifications: "/notification/fetch",
  fetchHistories: "/history/fetch",
  fetchDocument: "/document/fetch",
  contact: "/other/contact"
};

type ServerSpecs = {
  createDictionary: {
    request: {name: string},
    response: {
      success: Dictionary,
      error: never
    }
  },
  uploadDictionary: {
    request: {number: string},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  removeDictionary: {
    request: {number: number},
    response: {
      success: null,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionaryName: {
    request: {number: number, name: string},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionaryParamName: {
    request: {number: number, paramName: string},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionaryNumber" | "duplicateDictionaryParamName" | "invalidDictionaryParamName">
    }
  },
  changeDictionarySecret: {
    request: {number: number, secret: boolean},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionaryExplanation: {
    request: {number: number, explanation: string},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionarySettings: {
    request: {number: number, settings: Partial<DictionarySettings>},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  removeDictionaryAuthorizedUser: {
    request: {number: number, id: string},
    response: {
      success: null,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchDictionaryAuthorizedUser">
    }
  },
  addInvitation: {
    request: {number: number, type: InvitationType, userName: string},
    response: {
      success: Invitation,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchUser" | "userCanAlreadyEdit" | "userCanAlreadyOwn" | "editInvitationAlreadyAdded" | "transferInvitationAlreadyAdded">
    }
  },
  respondInvitation: {
    request: {id: string, accept: boolean},
    response: {
      success: Invitation,
      error: CustomError<"noSuchInvitation">
    }
  },
  editWord: {
    request: {number: number, word: EditableWord},
    response: {
      success: Word,
      error: CustomError<"noSuchDictionaryNumber" | "dictionarySaving">
    }
  },
  removeWord: {
    request: {number: number, wordNumber: number},
    response: {
      success: Word,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchWordNumber" | "dictionarySaving">
    }
  },
  addCommission: {
    request: WithRecaptcha<{number: number, name: string, comment?: string}>,
    response: {
      success: Commission,
      error: CustomError<"noSuchDictionaryNumber" | "emptyCommissionName">
    }
  },
  removeCommission: {
    request: {number: number, id: string},
    response: {
      success: Commission,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchCommission">
    }
  }
  searchDictionary: {
    request: {number: number, parameter: WordParameter, offset?: number, size?: number},
    response: {
      success: {words: WithSize<Word>, suggestions: Array<Suggestion>},
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  downloadDictionary: {
    request: {number: number, fileName?: string},
    response: {
      success: any,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchDictionary: {
    request: {number?: number, paramName?: string},
    response: {
      success: DetailedDictionary,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchDictionaryParamName" | "invalidArgument">
    }
  },
  suggestDictionaryTitles: {
    request: {number: number, propertyName: string, pattern: string},
    response: {
      success: Array<string>,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchDictionaryAuthorizedUsers: {
    request: {number: number, authority: DictionaryFullAuthority},
    response: {
      success: Array<User>,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchDictionaries: {
    request: {},
    response: {
      success: Array<UserDictionary>,
      error: never
    }
  },
  fetchAllDictionaries: {
    request: {order: string, offset?: number, size?: number},
    response: {
      success: WithSize<DetailedDictionary>,
      error: never
    }
  },
  fetchDictionaryAggregation: {
    request: {},
    response: {
      success: {dictionary: {count: number, wholeCount: number, size: number}, word: {count: number, wholeCount: number, size: number}},
      error: never
    }
  },
  fetchInvitations: {
    request: {type: InvitationType},
    response: {
      success: Array<Invitation>,
      error: never
    }
  },
  checkDictionaryAuthorization: {
    request: {number: number, authority: DictionaryAuthority},
    response: {
      success: null,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchCommissions: {
    request: {number: number, offset?: number, size?: number},
    response: {
      success: WithSize<Commission>,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  login: {
    request: {name: string, password: string},
    response: {
      success: {token: string, user: DetailedUser},
      error: never
    }
  },
  logout: {
    request: {},
    response: {
      success: null,
      error: never
    }
  },
  registerUser: {
    request: WithRecaptcha<{name: string, email: string, password: string}>,
    response: {
      success: User,
      error: CustomError<"duplicateUserName" | "duplicateUserEmail" | "invalidUserName" | "invalidUserEmail" | "invalidUserPassword">
    }
  },
  changeUserScreenName: {
    request: {screenName: string},
    response: {
      success: User,
      error: never
    }
  },
  changeUserEmail: {
    request: {email: string},
    response: {
      success: User,
      error: CustomError<"duplicateUserEmail" | "invalidUserEmail">
    }
  },
  changeUserPassword: {
    request: {password: string},
    response: {
      success: User,
      error: CustomError<"invalidUserPassword">
    }
  },
  issueUserResetToken: {
    request: WithRecaptcha<{name: string, email: string}>,
    response: {
      success: null,
      error: CustomError<"noSuchUser">
    }
  },
  resetUserPassword: {
    request: {key: string, password: string},
    response: {
      success: User,
      error: CustomError<"invalidResetToken" | "invalidUserPassword">
    }
  },
  removeUser: {
    request: {},
    response: {
      success: null,
      error: never
    }
  },
  fetchUser: {
    request: {},
    response: {
      success: DetailedUser,
      error: never
    }
  },
  suggestUsers: {
    request: {pattern: string},
    response: {
      success: Array<User>,
      error: never
    }
  },
  addNotification: {
    request: {type: string, title: string, text: string},
    response: {
      success: Notification,
      error: never
    }
  },
  fetchNotifications: {
    request: {offset?: number, size?: number},
    response: {
      success: WithSize<Notification>,
      error: never
    }
  },
  fetchHistories: {
    request: {number: number, from: string},
    response: {
      success: Array<History>,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchDocument: {
    request: {locale: string, path: string},
    response: {
      success: string,
      error: never
    }
  },
  contact: {
    request: WithRecaptcha<{name: string, email: string, subject: string, text: string}>,
    response: {
      success: null,
      error: CustomError<"emptyContactText" | "administratorNotFound">
    }
  }
};

export type WithRecaptcha<T> = T & {recaptchaToken: string};
export type WithSize<T> = [Array<T>, number];

export type Status = "success" | "error";
export type ProcessName = keyof ServerSpecs;

export type RequestData<N extends ProcessName> = Jsonify<ServerSpecs[N]["request"]>;
export type ResponseData<N extends ProcessName> = Jsonify<ServerSpecs[N]["response"]["success"]> | Jsonify<ServerSpecs[N]["response"]["error"]>;
export type ResponseEachData<N extends ProcessName, S extends Status> = Jsonify<ServerSpecs[N]["response"][S]>;