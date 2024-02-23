//

import {
  Jsonify
} from "jsonify-type";
import {
  Aggregation
} from "/client/skeleton/aggregation";
import {
  Commission
} from "/client/skeleton/commission";
import {
  DetailedDictionary,
  DetailedWord,
  Dictionary,
  DictionaryParameter,
  DictionarySettings,
  DictionaryStatistics,
  EditableExample,
  EditableWord,
  Example,
  Relation,
  Suggestion,
  UserDictionary,
  Word,
  WordNameFrequencies,
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
  discardDictionary: "/dictionary/discard",
  changeDictionaryName: "/dictionary/edit/name",
  changeDictionaryParamName: "/dictionary/edit/param-name",
  changeDictionarySecret: "/dictionary/edit/secret",
  changeDictionaryExplanation: "/dictionary/edit/explanation",
  changeDictionarySettings: "/dictionary/edit/settings",
  discardDictionaryAuthorizedUser: "/dictionary/user/discard",
  addInvitation: "/invitation/add",
  respondInvitation: "/invitation/respond",
  editWord: "/word/edit",
  discardWord: "/word/discard",
  addRelations: "/word/relation",
  editExample: "/example/edit",
  discardExample: "/example/discard",
  addCommission: "/commission/add",
  discardCommission: "/commission/discard",
  fetchCommissions: "/commission/fetch",
  searchDictionary: "/dictionary/search",
  searchWord: "/word/search",
  downloadDictionary: "/dictionary/download",
  suggestDictionaryTitles: "/dictionary/suggest/title",
  fetchDictionaryAuthorizedUsers: "/dictionary/user",
  fetchDictionaryAuthorization: "/dictionary/authorization",
  checkDictionaryAuthorization: "/dictionary/authorization/check",
  fetchDictionary: "/dictionary/fetch",
  fetchWordSize: "/dictionary/fetch/word-size",
  fetchWordNameFrequencies: "/dictionary/fetch/frequency",
  fetchDictionaryStatistics: "/dictionary/fetch/statistics",
  fetchDictionaries: "/dictionary/list",
  fetchUserDictionaries: "/dictionary/list/user",
  fetchAllDictionaries: "/dictionary/list/all",
  fetchOverallAggregation: "/dictionary/aggregate",
  fetchWord: "/word/fetch",
  fetchWordNames: "/word/name",
  checkDuplicateWordName: "/word/name/duplicate",
  fetchExample: "/example/fetch",
  fetchExamples: "/example/list",
  fetchInvitations: "/invitation/fetch",
  fetchUploadResourcePost: "/resource/upload",
  discardResource: "/resource/discard",
  fetchResources: "/resource/fetch",
  login: "/user/login",
  logout: "/user/logout",
  registerUser: "/user/register",
  changeUserScreenName: "/user/edit/screen-name",
  changeUserEmail: "/user/edit/email",
  changeUserPassword: "/user/edit/password",
  issueUserActivateToken: "/user/activate/token",
  issueUserResetToken: "/user/reset/token",
  activateUser: "/user/activate/activate",
  resetUserPassword: "/user/reset/reset",
  discardUser: "/user/discard",
  fetchUser: "/user/fetch",
  fetchOtherUser: "/user/fetch/other",
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
    request: WithRecaptcha<{number: string}>,
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionaryNumber" | "dictionarySizeTooLarge">
    }
  },
  discardDictionary: {
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
  discardDictionaryAuthorizedUser: {
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
  discardWord: {
    request: {number: number, wordNumber: number},
    response: {
      success: Word,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchWordNumber" | "dictionarySaving">
    }
  },
  addRelations: {
    request: {number: number, specs: Array<{wordNumber: number, relation: Relation}>},
    response: {
      success: null,
      error: CustomError<"noSuchDictionaryNumber" | "failAddRelations">
    }
  },
  editExample: {
    request: {number: number, example: EditableExample},
    response: {
      success: Example,
      error: CustomError<"noSuchDictionaryNumber" | "dictionarySaving">
    }
  },
  discardExample: {
    request: {number: number, exampleNumber: number},
    response: {
      success: Example,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchExampleNumber" | "dictionarySaving">
    }
  },
  addCommission: {
    request: WithRecaptcha<{number: number, name: string, comment?: string}>,
    response: {
      success: Commission,
      error: CustomError<"noSuchDictionaryNumber" | "emptyCommissionName">
    }
  },
  discardCommission: {
    request: {number: number, id: string},
    response: {
      success: Commission,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchCommission">
    }
  },
  fetchCommissions: {
    request: {number: number, offset?: number, size?: number},
    response: {
      success: WithSize<Commission>,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  searchDictionary: {
    request: {parameter: DictionaryParameter, offset?: number, size?: number},
    response: {
      success: WithSize<DetailedDictionary>,
      error: never
    }
  },
  searchWord: {
    request: {number: number, parameter: WordParameter, offset?: number, size?: number},
    response: {
      success: {words: WithSize<DetailedWord>, suggestions: Array<Suggestion>},
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
  fetchDictionaryAuthorization: {
    request: {number: number, authority: DictionaryAuthority},
    response: {
      success: boolean,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  checkDictionaryAuthorization: {
    request: {number: number, authority: DictionaryAuthority},
    response: {
      success: null,
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
  fetchWordSize: {
    request: {number: number},
    response: {
      success: number,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchWordNameFrequencies: {
    request: {number: number},
    response: {
      success: WordNameFrequencies,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchDictionaryStatistics: {
    request: {number: number},
    response: {
      success: DictionaryStatistics,
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
  fetchUserDictionaries: {
    request: {name: string},
    response: {
      success: Array<UserDictionary>,
      error: CustomError<"noSuchUser">
    }
  },
  fetchAllDictionaries: {
    request: {order: string, offset?: number, size?: number},
    response: {
      success: WithSize<DetailedDictionary>,
      error: never
    }
  },
  fetchOverallAggregation: {
    request: {},
    response: {
      success: {dictionary: Aggregation, word: Aggregation, example: Aggregation, user: Aggregation},
      error: never
    }
  },
  fetchWord: {
    request: {number: number, wordNumber: number},
    response: {
      success: DetailedWord,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchWordNumber">
    }
  },
  fetchWordNames: {
    request: {number: number, wordNumbers: Array<number>},
    response: {
      success: {names: Record<number, string | null>},
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  checkDuplicateWordName: {
    request: {number: number, name: string, excludedWordNumber?: number},
    response: {
      success: {duplicate: boolean},
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchExample: {
    request: {number: number, exampleNumber: number},
    response: {
      success: Example,
      error: CustomError<"noSuchDictionaryNumber" | "noSuchExampleNumber">
    }
  },
  fetchExamples: {
    request: {number: number, offset?: number, size?: number},
    response: {
      success: WithSize<Example>,
      error: CustomError<"noSuchDictionaryNumber">
    }
  },
  fetchInvitations: {
    request: {type: InvitationType},
    response: {
      success: Array<Invitation>,
      error: never
    }
  },
  fetchUploadResourcePost: {
    request: WithRecaptcha<{number: number, name: string, type: string}>,
    response: {
      success: {url: string, fields: Record<string, string>},
      error: CustomError<"noSuchDictionaryNumber" | "resourceCountExceeded" | "awsError">
    }
  },
  discardResource: {
    request: {number: number, name: string},
    response: {
      success: null,
      error: CustomError<"noSuchDictionaryNumber" | "awsError">
    }
  },
  fetchResources: {
    request: {number: number, offset?: number, size?: number},
    response: {
      success: WithSize<string>,
      error: CustomError<"noSuchDictionaryNumber" | "awsError">
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
  issueUserActivateToken: {
    request: WithRecaptcha<{}>,
    response: {
      success: null,
      error: CustomError<"noSuchUser" | "userAlreadyActivated">
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
  activateUser: {
    request: {key: string},
    response: {
      success: User,
      error: CustomError<"invalidActivateToken">
    }
  },
  discardUser: {
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
  fetchOtherUser: {
    request: {name: string},
    response: {
      success: User,
      error: CustomError<"noSuchUser">
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
      error: CustomError<"noSuchDocument">
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
export type SuccessResponseData<N extends ProcessName> = Jsonify<ServerSpecs[N]["response"]["success"]>;
export type ErrorResponseData<N extends ProcessName> = Jsonify<ServerSpecs[N]["response"]["error"]>;
export type ResponseData<N extends ProcessName> = SuccessResponseData<N> | ErrorResponseData<N>;
export type ResponseEachData<N extends ProcessName, S extends Status> = Jsonify<ServerSpecs[N]["response"][S]>;