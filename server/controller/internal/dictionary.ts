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
  verifyDictionary,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  DictionaryCreator,
  DictionaryModel,
  SearchParameterCreator,
  SuggestionCreator,
  WordCreator,
  WordModel
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
    let user = request.user!;
    let name = request.body.name;
    let dictionary = await DictionaryModel.addEmpty(name, user);
    let body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["uploadDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"uploadDictionary">, response: Response<"uploadDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    let path = request.file.path;
    let originalPath = request.file.originalname;
    if (dictionary) {
      let promise = new Promise(async (resolve, reject) => {
        try {
          await dictionary!.upload(path, originalPath);
          await fs.unlink(path);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      let body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["removeDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"removeDictionary">, response: Response<"removeDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    if (dictionary) {
      await dictionary.removeOne();
      Controller.respond(response, null);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionaryName"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryName">, response: Response<"changeDictionaryName">): Promise<void> {
    let dictionary = request.dictionary;
    let name = request.body.name;
    if (dictionary) {
      await dictionary.changeName(name);
      let body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionaryParamName"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryParamName">, response: Response<"changeDictionaryParamName">): Promise<void> {
    let dictionary = request.dictionary;
    let paramName = request.body.paramName;
    if (dictionary) {
      try {
        await dictionary.changeParamName(paramName);
        let body = DictionaryCreator.create(dictionary);
        Controller.respond(response, body);
      } catch (error) {
        let body = (() => {
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
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["removeDictionaryAuthorizedUser"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"removeDictionaryAuthorizedUser">, response: Response<"removeDictionaryAuthorizedUser">): Promise<void> {
    let dictionary = request.dictionary;
    let id = request.body.id;
    let user = await UserModel.findById(id);
    if (dictionary) {
      if (user) {
        try {
          await dictionary.removeAuthorizedUser(user);
          Controller.respond(response, null);
        } catch (error) {
          let body = (() => {
            if (error.name === "CustomError" && error.type === "noSuchDictionaryAuthorizedUser") {
              return CustomError.ofType("noSuchDictionaryAuthorizedUser");
            }
          })();
          Controller.respondError(response, body, error);
        }
      } else {
        let body = CustomError.ofType("noSuchDictionaryAuthorizedUser");
        Controller.respondError(response, body);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionarySecret"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySecret">, response: Response<"changeDictionarySecret">): Promise<void> {
    let dictionary = request.dictionary;
    let secret = request.body.secret;
    if (dictionary) {
      await dictionary.changeSecret(secret);
      let body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionaryExplanation"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryExplanation">, response: Response<"changeDictionaryExplanation">): Promise<void> {
    let dictionary = request.dictionary;
    let explanation = request.body.explanation;
    if (dictionary) {
      await dictionary.changeExplanation(explanation);
      let body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionarySettings"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySettings">, response: Response<"changeDictionarySettings">): Promise<void> {
    let dictionary = request.dictionary;
    let settings = request.body.settings;
    if (dictionary) {
      await dictionary.changeSettings(settings);
      let body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["searchDictionary"])
  public async [Symbol()](request: Request<"searchDictionary">, response: Response<"searchDictionary">): Promise<void> {
    let number = request.body.number;
    let parameter = SearchParameterCreator.restore(request.body.parameter);
    let offset = request.body.offset;
    let size = request.body.size;
    let dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      let range = new QueryRange(offset, size);
      let hitResult = await dictionary.search(parameter, range);
      let hitWords = hitResult.words[0].map(WordCreator.create);
      let hitSize = hitResult.words[1];
      let hitSuggestions = hitResult.suggestions.map(SuggestionCreator.create);
      let body = {words: [hitWords, hitSize], suggestions: hitSuggestions} as any;
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["downloadDictionary"])
  public async [Symbol()](request: Request<"downloadDictionary">, response: Response<"downloadDictionary">): Promise<void> {
    let number = request.body.number;
    let fileName = request.body.fileName;
    let dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      let date = new Date();
      let id = date.getTime();
      let path = "./dist/download/" + id + ".json";
      let fullFileName = sanitizeFileName(fileName || dictionary.name) + ".json";
      await dictionary.download(path);
      response.download(path, fullFileName);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDictionary"])
  public async [Symbol()](request: Request<"fetchDictionary">, response: Response<"fetchDictionary">): Promise<void> {
    let number = request.body.number;
    let paramName = request.body.paramName;
    let value = number ?? paramName;
    if (value !== undefined) {
      let dictionary = await DictionaryModel.fetchOneByValue(value);
      if (dictionary) {
        let body = await DictionaryCreator.createDetailed(dictionary);
        Controller.respond(response, body);
      } else {
        let body = (() => {
          if (number !== undefined) {
            return CustomError.ofType("noSuchDictionaryNumber");
          } else {
            return CustomError.ofType("noSuchDictionaryParamName");
          }
        })();
        Controller.respondError(response, body);
      }
    } else {
      let body = CustomError.ofType("invalidArgument");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["suggestDictionaryTitles"])
  public async [Symbol()](request: Request<"suggestDictionaryTitles">, response: Response<"suggestDictionaryTitles">): Promise<void> {
    let number = request.body.number;
    let propertyName = request.body.propertyName;
    let pattern = request.body.pattern;
    let dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      let titles = await dictionary.suggestTitles(propertyName, pattern);
      let body = titles;
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDictionaryAuthorizedUsers"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchDictionaryAuthorizedUsers">, response: Response<"fetchDictionaryAuthorizedUsers">): Promise<void> {
    let dictionary = request.dictionary;
    let authority = request.body.authority;
    if (dictionary) {
      let users = await dictionary.fetchAuthorizedUsers(authority);
      let body = users.map(UserCreator.create);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDictionaries"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchDictionaries">, response: Response<"fetchDictionaries">): Promise<void> {
    let user = request.user!;
    let dictionaries = await DictionaryModel.fetchByUser(user, "edit");
    let promises = dictionaries.map((dictionary) => {
      let promise = new Promise<UserDictionary>(async (resolve, reject) => {
        try {
          let skeleton = await DictionaryCreator.createUser(dictionary, user);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let body = await Promise.all(promises);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchAllDictionaries"])
  public async [Symbol()](request: Request<"fetchAllDictionaries">, response: Response<"fetchAllDictionaries">): Promise<void> {
    let order = request.body.order;
    let offset = request.body.offset;
    let size = request.body.size;
    let range = new QueryRange(offset, size);
    let hitResult = await DictionaryModel.fetch(order, range);
    let hitPromises = hitResult[0].map((hitDictionary) => {
      let promise = new Promise<DetailedDictionary>(async (resolve, reject) => {
        try {
          let skeleton = await DictionaryCreator.createDetailed(hitDictionary);
          resolve(skeleton);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    });
    let hitDictionaries = await Promise.all(hitPromises);
    let hitSize = hitResult[1];
    let body = [hitDictionaries, hitSize] as any;
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchDictionaryAggregation"])
  public async [Symbol()](request: Request<"fetchDictionaryAggregation">, response: Response<"fetchDictionaryAggregation">): Promise<void> {
    let dictionaryRawPromises = Promise.all([DictionaryModel.findExist().countDocuments(), DictionaryModel.estimatedDocumentCount(), DictionaryModel.collection.stats()]);
    let dictionaryPromises = dictionaryRawPromises.then(([count, wholeCount, stats]) => {
      let size = stats.size;
      return {count, wholeCount, size};
    });
    let wordRawPromises = Promise.all([WordModel.findExist().countDocuments(), WordModel.estimatedDocumentCount(), WordModel.collection.stats()]);
    let wordPromises = wordRawPromises.then(([count, wholeCount, stats]) => {
      let size = stats.size;
      return {count, wholeCount, size};
    });
    let [dictionary, word] = await Promise.all([dictionaryPromises, wordPromises]);
    let body = {dictionary, word};
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["checkDictionaryAuthorization"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"checkDictionaryAuthorization">, response: Response<"checkDictionaryAuthorization">): Promise<void> {
    let user = request.user!;
    let number = request.body.number;
    let authority = request.body.authority;
    let dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      let hasAuthority = await dictionary.hasAuthority(user, authority);
      if (hasAuthority) {
        Controller.respond(response, null);
      } else {
        Controller.respondForbidden(response);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}