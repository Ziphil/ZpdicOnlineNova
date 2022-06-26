//

import {
  promises as fs
} from "fs";
import {
  DetailedDictionary,
  UserDictionary
} from "/client/skeleton/dictionary";
import {
  CustomError
} from "/client/skeleton/error";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  Controller,
  Request,
  Response
} from "/server/controller/internal/controller";
import {
  checkUser,
  verifyDictionary,
  verifyRecaptcha,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  DictionaryCreator,
  DictionaryModel,
  ExampleModel,
  SuggestionCreator,
  WordCreator,
  WordModel,
  WordParameterCreator
} from "/server/model/dictionary";
import {
  UserCreator,
  UserModel
} from "/server/model/user";
import {
  sanitizeFileName
} from "/server/util/misc";
import {
  QueryRange
} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class DictionaryController extends Controller {

  @post(SERVER_PATHS["createDictionary"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"createDictionary">, response: Response<"createDictionary">): Promise<void> {
    const user = request.user!;
    const name = request.body.name;
    const dictionary = await DictionaryModel.addEmpty(name, user);
    const body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["uploadDictionary"])
  @before(verifyRecaptcha(), verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"uploadDictionary">, response: Response<"uploadDictionary">): Promise<void> {
    const dictionary = request.dictionary;
    const path = request.file!.path;
    const originalPath = request.file!.originalname;
    if (dictionary) {
      if (request.file!.size <= 5 * 1024 * 1024) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            await dictionary.upload(path, originalPath);
            await fs.unlink(path);
            resolve(null);
          } catch (error) {
            reject(error);
          }
        });
        const body = DictionaryCreator.create(dictionary);
        Controller.respond(response, body);
      } else {
        const body = CustomError.ofType("dictionarySizeTooLarge");
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["discardDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"discardDictionary">, response: Response<"discardDictionary">): Promise<void> {
    const dictionary = request.dictionary;
    if (dictionary) {
      await dictionary.discard();
      Controller.respond(response, null);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionaryName"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryName">, response: Response<"changeDictionaryName">): Promise<void> {
    const dictionary = request.dictionary;
    const name = request.body.name;
    if (dictionary) {
      await dictionary.changeName(name);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionaryParamName"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryParamName">, response: Response<"changeDictionaryParamName">): Promise<void> {
    const dictionary = request.dictionary;
    const paramName = request.body.paramName;
    if (dictionary) {
      try {
        await dictionary.changeParamName(paramName);
        const body = DictionaryCreator.create(dictionary);
        Controller.respond(response, body);
      } catch (error) {
        const body = (() => {
          if (error.name === "CustomError") {
            if (error.type === "duplicateDictionaryParamName") {
              return CustomError.ofType("duplicateDictionaryParamName");
            }
          } else if (error.name === "ValidationError") {
            if (error.errors.paramName) {
              return CustomError.ofType("invalidDictionaryParamName");
            }
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["discardDictionaryAuthorizedUser"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"discardDictionaryAuthorizedUser">, response: Response<"discardDictionaryAuthorizedUser">): Promise<void> {
    const dictionary = request.dictionary;
    const id = request.body.id;
    const user = await UserModel.findById(id);
    if (dictionary) {
      if (user) {
        try {
          await dictionary.discardAuthorizedUser(user);
          Controller.respond(response, null);
        } catch (error) {
          const body = (() => {
            if (error.name === "CustomError" && error.type === "noSuchDictionaryAuthorizedUser") {
              return CustomError.ofType("noSuchDictionaryAuthorizedUser");
            }
          })();
          Controller.respondError(response, body, error);
        }
      } else {
        const body = CustomError.ofType("noSuchDictionaryAuthorizedUser");
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionarySecret"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySecret">, response: Response<"changeDictionarySecret">): Promise<void> {
    const dictionary = request.dictionary;
    const secret = request.body.secret;
    if (dictionary) {
      await dictionary.changeSecret(secret);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionaryExplanation"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryExplanation">, response: Response<"changeDictionaryExplanation">): Promise<void> {
    const dictionary = request.dictionary;
    const explanation = request.body.explanation;
    if (dictionary) {
      await dictionary.changeExplanation(explanation);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionarySettings"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySettings">, response: Response<"changeDictionarySettings">): Promise<void> {
    const dictionary = request.dictionary;
    const settings = request.body.settings;
    if (dictionary) {
      await dictionary.changeSettings(settings);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["searchDictionary"])
  public async [Symbol()](request: Request<"searchDictionary">, response: Response<"searchDictionary">): Promise<void> {
    const number = request.body.number;
    const parameter = WordParameterCreator.recreate(request.body.parameter);
    const offset = request.body.offset;
    const size = request.body.size;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const range = new QueryRange(offset, size);
      const hitResult = await dictionary.search(parameter, range);
      const hitWords = await Promise.all(hitResult.words[0].map(WordCreator.createDetailed));
      const hitSize = hitResult.words[1];
      const hitSuggestions = hitResult.suggestions.map(SuggestionCreator.create);
      const body = {words: [hitWords, hitSize], suggestions: hitSuggestions} as any;
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["downloadDictionary"])
  public async [Symbol()](request: Request<"downloadDictionary">, response: Response<"downloadDictionary">): Promise<void> {
    const number = request.body.number;
    const fileName = request.body.fileName;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const date = new Date();
      const id = date.getTime();
      const path = "./dist/download/" + id + ".json";
      const fullFileName = sanitizeFileName(fileName || dictionary.name) + ".json";
      await dictionary.download(path);
      response.download(path, fullFileName);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDictionary"])
  public async [Symbol()](request: Request<"fetchDictionary">, response: Response<"fetchDictionary">): Promise<void> {
    const number = request.body.number;
    const paramName = request.body.paramName;
    const value = number ?? paramName;
    if (value !== undefined) {
      const dictionary = await DictionaryModel.fetchOneByValue(value);
      if (dictionary) {
        const body = await DictionaryCreator.createDetailed(dictionary);
        Controller.respond(response, body);
      } else {
        const body = (() => {
          if (number !== undefined) {
            return CustomError.ofType("noSuchDictionaryNumber");
          } else {
            return CustomError.ofType("noSuchDictionaryParamName");
          }
        })();
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("invalidArgument");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchWordSize"])
  public async [Symbol()](request: Request<"fetchWordSize">, response: Response<"fetchWordSize">): Promise<void> {
    const number = request.body.number;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const body = await dictionary.countWords();
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchWordNameFrequencies"])
  public async [Symbol()](request: Request<"fetchWordNameFrequencies">, response: Response<"fetchWordNameFrequencies">): Promise<void> {
    const number = request.body.number;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const body = await dictionary.calcWordNameFrequencies();
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDictionaryStatistics"])
  public async [Symbol()](request: Request<"fetchDictionaryStatistics">, response: Response<"fetchDictionaryStatistics">): Promise<void> {
    const number = request.body.number;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const body = await dictionary.calcStatistics();
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["suggestDictionaryTitles"])
  public async [Symbol()](request: Request<"suggestDictionaryTitles">, response: Response<"suggestDictionaryTitles">): Promise<void> {
    const number = request.body.number;
    const propertyName = request.body.propertyName;
    const pattern = request.body.pattern;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const titles = await dictionary.suggestTitles(propertyName, pattern);
      const body = titles;
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDictionaryAuthorizedUsers"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchDictionaryAuthorizedUsers">, response: Response<"fetchDictionaryAuthorizedUsers">): Promise<void> {
    const dictionary = request.dictionary;
    const authority = request.body.authority;
    if (dictionary) {
      const users = await dictionary.fetchAuthorizedUsers(authority);
      const body = users.map(UserCreator.create);
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDictionaries"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchDictionaries">, response: Response<"fetchDictionaries">): Promise<void> {
    const user = request.user!;
    const dictionaries = await DictionaryModel.fetchByUser(user, "edit");
    const promises = dictionaries.map((dictionary) => {
      const promise = new Promise<UserDictionary>(async (resolve, reject) => {
        try {
          const skeleton = await DictionaryCreator.createUser(dictionary, user);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    const body = await Promise.all(promises);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchAllDictionaries"])
  public async [Symbol()](request: Request<"fetchAllDictionaries">, response: Response<"fetchAllDictionaries">): Promise<void> {
    const order = request.body.order;
    const offset = request.body.offset;
    const size = request.body.size;
    const range = new QueryRange(offset, size);
    const hitResult = await DictionaryModel.fetch(order, range);
    const hitPromises = hitResult[0].map((hitDictionary) => {
      const promise = new Promise<DetailedDictionary>(async (resolve, reject) => {
        try {
          const skeleton = await DictionaryCreator.createDetailed(hitDictionary);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    const hitDictionaries = await Promise.all(hitPromises);
    const hitSize = hitResult[1];
    const body = [hitDictionaries, hitSize] as any;
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchOverallAggregation"])
  public async [Symbol()](request: Request<"fetchOverallAggregation">, response: Response<"fetchOverallAggregation">): Promise<void> {
    const models = [DictionaryModel, WordModel, ExampleModel, UserModel] as Array<any>;
    const promises = models.map((model) => {
      if (model === UserModel) {
        const promise = Promise.all([model.estimatedDocumentCount(), model.collection.stats()]).then(([count, stats]) => {
          const wholeCount = count;
          const size = stats.size;
          return {count, wholeCount, size};
        });
        return promise;
      } else {
        const promise = Promise.all([model.findExist().countDocuments(), model.estimatedDocumentCount(), model.collection.stats()]).then(([count, wholeCount, stats]) => {
          const size = stats.size;
          return {count, wholeCount, size};
        });
        return promise;
      }
    });
    const [dictionary, word, example, user] = await Promise.all(promises);
    const body = {dictionary, word, example, user};
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchDictionaryAuthorization"])
  @before(checkUser())
  public async [Symbol()](request: Request<"fetchDictionaryAuthorization">, response: Response<"fetchDictionaryAuthorization">): Promise<void> {
    const user = request.user;
    const number = request.body.number;
    const authority = request.body.authority;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      if (user) {
        const hasAuthority = await dictionary.hasAuthority(user, authority);
        if (hasAuthority) {
          Controller.respond(response, true);
        } else {
          Controller.respond(response, false);
        }
      } else {
        Controller.respond(response, false);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["checkDictionaryAuthorization"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"checkDictionaryAuthorization">, response: Response<"checkDictionaryAuthorization">): Promise<void> {
    const user = request.user!;
    const number = request.body.number;
    const authority = request.body.authority;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const hasAuthority = await dictionary.hasAuthority(user, authority);
      if (hasAuthority) {
        Controller.respond(response, null);
      } else {
        Controller.respondForbidden(response);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}