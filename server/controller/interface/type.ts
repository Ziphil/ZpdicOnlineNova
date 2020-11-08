//

import {
  ValueOf
} from "ts-essentials";
import {
  Commission
} from "/client/skeleton/commission";
import {
  DetailedDictionary,
  Dictionary,
  DictionarySettings,
  EditWord,
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
  Invitation
} from "/client/skeleton/invitation";
import {
  Notification
} from "/client/skeleton/notification";
import {
  DetailedUser,
  User
} from "/client/skeleton/user";


export const SERVER_PATH_PREFIX = "/internal/" + process.env["npm_package_version"];
export const SERVER_PATHS = {
  createDictionary: "/dictionary/create",
  uploadDictionary: "/dictionary/upload",
  deleteDictionary: "/dictionary/delete",
  changeDictionaryName: "/dictionary/edit/name",
  changeDictionaryParamName: "/dictionary/edit/param-name",
  changeDictionarySecret: "/dictionary/edit/secret",
  changeDictionaryExplanation: "/dictionary/edit/explanation",
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

type ServerSpecs = {
  createDictionary: {
    request: {name: string},
    response: {
      200: Dictionary,
      400: never
    }
  },
  uploadDictionary: {
    request: {number: number},
    response: {
      200: Dictionary,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  deleteDictionary: {
    request: {number: number},
    response: {
      200: null,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionaryName: {
    request: {number: number, name: string},
    response: {
      200: Dictionary,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionaryParamName: {
    request: {number: number, paramName: string},
    response: {
      200: Dictionary,
      400: CustomError<"noSuchDictionaryNumber" | "duplicateDictionaryParamName" | "invalidDictionaryParamName">
    }
  },
  changeDictionarySecret: {
    request: {number: number, secret: boolean},
    response: {
      200: Dictionary,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionaryExplanation: {
    request: {number: number, explanation: string},
    response: {
      200: Dictionary,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  changeDictionarySettings: {
    request: {number: number, settings: Partial<DictionarySettings>},
    response: {
      200: Dictionary,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  deleteDictionaryAuthorizedUser: {
    request: {number: number, id: string},
    response: {
      200: null,
      400: CustomError<"noSuchDictionaryNumber" | "noSuchDictionaryAuthorizedUser">
    }
  },
  addInvitation: {
    request: {number: number, type: string, userName: string},
    response: {
      200: Invitation,
      400: CustomError<"noSuchDictionaryNumber" | "noSuchUser" | "userCanAlreadyEdit" | "userCanAlreadyOwn" | "editInvitationAlreadyAdded" | "transferInvitationAlreadyAdded">
    }
  },
  respondInvitation: {
    request: {id: string, accept: boolean},
    response: {
      200: Invitation,
      400: CustomError<"noSuchInvitation">
    }
  },
  editWord: {
    request: {number: number, word: EditWord},
    response: {
      200: Word,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  deleteWord: {
    request: {number: number, wordNumber: number},
    response: {
      200: Word,
      400: CustomError<"noSuchDictionaryNumber" | "noSuchWordNumber">
    }
  },
  addCommission: {
    request: WithRecaptcha<{number: number, name: string, comment?: string}>,
    response: {
      200: Commission,
      400: CustomError<"noSuchDictionaryNumber" | "emptyCommissionName">
    }
  },
  deleteCommission: {
    request: {number: number, id: string},
    response: {
      200: Commission,
      400: CustomError<"noSuchDictionaryNumber" | "noSuchCommission">
    }
  }
  searchDictionary: {
    request: {number: number, parameter: WordParameter, offset?: number, size?: number},
    response: {
      200: {words: WithSize<Word>, suggestions: Array<Suggestion>},
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  downloadDictionary: {
    request: {number: number, fileName?: string},
    response: {
      200: never,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchDictionary: {
    request: {number?: number, paramName?: string},
    response: {
      200: DetailedDictionary,
      400: CustomError<"noSuchDictionaryNumber" | "noSuchDictionaryParamName" | "invalidArgument">
    }
  },
  suggestDictionaryTitles: {
    request: {number: number, propertyName: string, pattern: string},
    response: {
      200: Array<string>,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchDictionaryAuthorizedUsers: {
    request: {number: number, authority: string},
    response: {
      200: Array<User>,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchWholeDictionary: {
    request: {number: number},
    response: {
      200: DetailedDictionary,
      400: CustomError<"noSuchDictionaryNumber">
    }
  }
  fetchDictionaries: {
    request: {},
    response: {
      200: Array<UserDictionary>,
      400: never
    }
  },
  fetchAllDictionaries: {
    request: {order: string, offset?: number, size?: number},
    response: {
      200: WithSize<DetailedDictionary>,
      400: never
    }
  },
  fetchDictionaryAggregation: {
    request: {},
    response: {
      200: {dictionaryCount: number, wordCount: number, dictionarySize: number, wordSize: number},
      400: never
    }
  },
  fetchInvitations: {
    request: {type: string},
    response: {
      200: Array<Invitation>,
      400: never
    }
  },
  checkDictionaryAuthorization: {
    request: {number: number, authority: string},
    response: {
      200: null,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchCommissions: {
    request: {number: number, offset?: number, size?: number},
    response: {
      200: WithSize<Commission>,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  login: {
    request: {name: string, password: string},
    response: {
      200: {token: string, user: DetailedUser},
      400: never
    }
  },
  logout: {
    request: {},
    response: {
      200: null,
      400: never
    }
  },
  registerUser: {
    request: WithRecaptcha<{name: string, email: string, password: string}>,
    response: {
      200: User,
      400: CustomError<"duplicateUserName" | "duplicateUserEmail" | "invalidUserName" | "invalidUserEmail" | "invalidUserPassword">
    }
  },
  changeUserScreenName: {
    request: {screenName: string},
    response: {
      200: User,
      400: never
    }
  },
  changeUserEmail: {
    request: {email: string},
    response: {
      200: User,
      400: CustomError<"duplicateUserEmail" | "invalidUserEmail">
    }
  },
  changeUserPassword: {
    request: {password: string},
    response: {
      200: User,
      400: CustomError<"invalidUserPassword">
    }
  },
  issueUserResetToken: {
    request: WithRecaptcha<{name: string, email: string}>,
    response: {
      200: null,
      400: CustomError<"noSuchUser">
    }
  },
  resetUserPassword: {
    request: {key: string, password: string},
    response: {
      200: User,
      400: CustomError<"invalidResetToken" | "invalidUserPassword">
    }
  },
  deleteUser: {
    request: {},
    response: {
      200: null,
      400: never
    }
  },
  fetchUser: {
    request: {},
    response: {
      200: DetailedUser,
      400: never
    }
  },
  suggestUsers: {
    request: {pattern: string},
    response: {
      200: Array<User>,
      400: never
    }
  },
  addNotification: {
    request: {type: string, title: string, text: string},
    response: {
      200: Notification,
      400: never
    }
  },
  fetchNotifications: {
    request: {offset?: number, size?: number},
    response: {
      200: WithSize<Notification>,
      400: never
    }
  },
  fetchHistories: {
    request: {number: number, from: string},
    response: {
      200: Array<History>,
      400: CustomError<"noSuchDictionaryNumber">
    }
  },
  contact: {
    request: WithRecaptcha<{name: string, email: string, subject: string, text: string}>,
    response: {
      200: null,
      400: CustomError<"emptyContactText" | "administratorNotFound">
    }
  }
};

export type WithRecaptcha<T> = T & {recaptchaToken: string};
export type WithSize<T> = [Array<T>, number];

export type Status = 200 | 400;
export type ProcessName = keyof ServerSpecs;

export type RequestData<N extends ProcessName> = ServerSpecs[N]["request"];
export type ResponseData<N extends ProcessName> = ValueOf<ServerSpecs[N]["response"]>;
export type ResponseEachData<N extends ProcessName, S extends Status> = ServerSpecs[N]["response"][S];