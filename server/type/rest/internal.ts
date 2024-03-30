//

import type {
  Aggregation,
  Commission,
  CustomError,
  DetailedDictionary,
  DetailedUser,
  DetailedWord,
  Dictionary,
  DictionaryParameter,
  DictionarySettings,
  DictionaryStatistics,
  EditableExample,
  EditableWord,
  Example,
  ExampleOffer,
  History,
  Invitation,
  InvitationType,
  Notification,
  ObjectId,
  Relation,
  Suggestion,
  User,
  UserDictionary,
  Word,
  WordNameFrequencies,
  WordParameter
} from "/client/skeleton";
import type {DictionaryAuthority, DictionaryFullAuthority} from "/server/model";
import type {WithRecaptcha, WithSize} from "/server/type/common";


export const SERVER_PATH_PREFIX = "/internal/" + process.env["npm_package_version"];

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
      error: CustomError<"noSuchDictionary" | "dictionarySizeTooLarge" | "invalidArgument">
    }
  },
  discardDictionary: {
    request: {number: number},
    response: {
      success: null,
      error: CustomError<"noSuchDictionary">
    }
  },
  changeDictionaryName: {
    request: {number: number, name: string},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionary">
    }
  },
  changeDictionaryParamName: {
    request: {number: number, paramName: string},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionary" | "duplicateDictionaryParamName" | "invalidDictionaryParamName">
    }
  },
  changeDictionarySecret: {
    request: {number: number, secret: boolean},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionary">
    }
  },
  changeDictionaryExplanation: {
    request: {number: number, explanation: string},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionary">
    }
  },
  changeDictionarySettings: {
    request: {number: number, settings: Partial<DictionarySettings>},
    response: {
      success: Dictionary,
      error: CustomError<"noSuchDictionary">
    }
  },
  discardDictionaryAuthorizedUser: {
    request: {number: number, id: ObjectId},
    response: {
      success: null,
      error: CustomError<"noSuchDictionary" | "noSuchDictionaryAuthorizedUser">
    }
  },
  addInvitation: {
    request: {number: number, type: InvitationType, userName: string},
    response: {
      success: Invitation,
      error: CustomError<"noSuchDictionary" | "noSuchUser" | "userCanAlreadyEdit" | "userCanAlreadyOwn" | "editInvitationAlreadyAdded" | "transferInvitationAlreadyAdded">
    }
  },
  respondInvitation: {
    request: {id: ObjectId, accept: boolean},
    response: {
      success: Invitation,
      error: CustomError<"noSuchInvitation">
    }
  },
  editWord: {
    request: {number: number, word: EditableWord},
    response: {
      success: Word,
      error: CustomError<"noSuchDictionary" | "dictionarySaving">
    }
  },
  discardWord: {
    request: {number: number, wordNumber: number},
    response: {
      success: Word,
      error: CustomError<"noSuchDictionary" | "noSuchWord" | "dictionarySaving">
    }
  },
  addRelations: {
    request: {number: number, specs: Array<{wordNumber: number, relation: Relation}>},
    response: {
      success: null,
      error: CustomError<"noSuchDictionary" | "failAddRelations">
    }
  },
  editExample: {
    request: {number: number, example: EditableExample},
    response: {
      success: Example,
      error: CustomError<"noSuchDictionary" | "dictionarySaving">
    }
  },
  discardExample: {
    request: {number: number, exampleNumber: number},
    response: {
      success: Example,
      error: CustomError<"noSuchDictionary" | "noSuchExample" | "dictionarySaving">
    }
  },
  addCommission: {
    request: WithRecaptcha<{number: number, name: string, comment?: string}>,
    response: {
      success: Commission,
      error: CustomError<"noSuchDictionary" | "emptyCommissionName">
    }
  },
  discardCommission: {
    request: {number: number, id: ObjectId},
    response: {
      success: Commission,
      error: CustomError<"noSuchDictionary" | "noSuchCommission">
    }
  },
  fetchCommissions: {
    request: {number: number, offset?: number, size?: number},
    response: {
      success: WithSize<Commission>,
      error: CustomError<"noSuchDictionary">
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
      error: CustomError<"noSuchDictionary">
    }
  },
  downloadDictionary: {
    request: {number: number},
    response: {
      success: {key: string},
      error: CustomError<"noSuchDictionary">
    }
  },
  downloadDictionaryFile: {
    request: {key: string, fileName?: string},
    response: {
      success: any,
      error: never
    }
  },
  suggestDictionaryTitles: {
    request: {number: number, propertyName: string, pattern: string},
    response: {
      success: Array<string>,
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchDictionaryAuthorizedUsers: {
    request: {number: number, authority: DictionaryFullAuthority},
    response: {
      success: Array<User>,
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchDictionaryAuthorization: {
    request: {identifier: number | string, authority: DictionaryAuthority},
    response: {
      success: boolean,
      error: CustomError<"noSuchDictionary">
    }
  },
  checkDictionaryAuthorization: {
    request: {identifier: number | string, authority: DictionaryAuthority},
    response: {
      success: null,
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchDictionary: {
    request: {identifier: number | string},
    response: {
      success: DetailedDictionary,
      error: CustomError<"noSuchDictionary" | "invalidArgument">
    }
  },
  fetchDictionarySizes: {
    request: {number: number},
    response: {
      success: {word: number, example: number},
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchWordNameFrequencies: {
    request: {number: number},
    response: {
      success: WordNameFrequencies,
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchDictionaryStatistics: {
    request: {number: number},
    response: {
      success: DictionaryStatistics,
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchUserDictionaries: {
    request: {name: string},
    response: {
      success: Array<UserDictionary>,
      error: CustomError<"noSuchUser">
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
      error: CustomError<"noSuchDictionary" | "noSuchWord">
    }
  },
  fetchWordNames: {
    request: {number: number, wordNumbers: Array<number>},
    response: {
      success: {names: Record<number, string | null>},
      error: CustomError<"noSuchDictionary">
    }
  },
  checkDuplicateWordName: {
    request: {number: number, name: string, excludedWordNumber?: number},
    response: {
      success: {duplicate: boolean},
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchExample: {
    request: {number: number, exampleNumber: number},
    response: {
      success: Example,
      error: CustomError<"noSuchDictionary" | "noSuchExample">
    }
  },
  fetchExamples: {
    request: {number: number, offset?: number, size?: number},
    response: {
      success: WithSize<Example>,
      error: CustomError<"noSuchDictionary">
    }
  },
  fetchExamplesByOffer: {
    request: {number?: number, offerId: ObjectId, offset?: number, size?: number},
    response: {
      success: WithSize<Example>,
      error: never
    }
  },
  fetchExampleOffers: {
    request: {offset?: number, size?: number},
    response: {
      success: WithSize<ExampleOffer>,
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
  fetchUploadResourcePost: {
    request: WithRecaptcha<{number: number, name: string, type: string}>,
    response: {
      success: {url: string, fields: Record<string, string>},
      error: CustomError<"noSuchDictionary" | "resourceCountExceeded" | "awsError">
    }
  },
  discardResource: {
    request: {number: number, name: string},
    response: {
      success: null,
      error: CustomError<"noSuchDictionary" | "awsError">
    }
  },
  fetchResources: {
    request: {number: number, offset?: number, size?: number},
    response: {
      success: WithSize<string>,
      error: CustomError<"noSuchDictionary" | "awsError">
    }
  },
  fetchUploadDictionaryFontPost: {
    request: WithRecaptcha<{number: number}>,
    response: {
      success: {url: string, fields: Record<string, string>},
      error: CustomError<"noSuchDictionary" | "awsError">
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
  changeMyScreenName: {
    request: {screenName: string},
    response: {
      success: User,
      error: never
    }
  },
  changeMyEmail: {
    request: {email: string},
    response: {
      success: User,
      error: CustomError<"duplicateUserEmail" | "invalidUserEmail">
    }
  },
  changeMyPassword: {
    request: {password: string},
    response: {
      success: User,
      error: CustomError<"invalidUserPassword">
    }
  },
  issueMyActivateToken: {
    request: WithRecaptcha<{}>,
    response: {
      success: null,
      error: CustomError<"noSuchUser" | "userAlreadyActivated">
    }
  },
  issueUserResetToken: {
    request: WithRecaptcha<{email: string}>,
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
  activateMe: {
    request: {key: string},
    response: {
      success: User,
      error: CustomError<"invalidActivateToken">
    }
  },
  discardMe: {
    request: {},
    response: {
      success: null,
      error: never
    }
  },
  fetchMe: {
    request: {},
    response: {
      success: DetailedUser,
      error: never
    }
  },
  fetchUser: {
    request: {name: string},
    response: {
      success: User,
      error: CustomError<"noSuchUser">
    }
  },
  fetchUploadMyAvatarPost: {
    request: WithRecaptcha<{}>,
    response: {
      success: {url: string, fields: Record<string, string>},
      error: CustomError<"awsError">
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
      error: CustomError<"noSuchDictionary">
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

export type Status = "success" | "error";
export type ProcessName = keyof ServerSpecs;

export type RequestData<N extends ProcessName> = ServerSpecs[N]["request"];
export type ResponseData<N extends ProcessName> = SuccessResponseData<N> | ErrorResponseData<N>;
export type SuccessResponseData<N extends ProcessName> = ServerSpecs[N]["response"]["success"];
export type ErrorResponseData<N extends ProcessName> = ServerSpecs[N]["response"]["error"];
