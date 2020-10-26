//

import {
  promises as fs
} from "fs";
import {
  Controller,
  GetRequest,
  GetResponse,
  PostRequest,
  PostResponse
} from "/server/controller/controller";
import {
  before,
  controller,
  get,
  post
} from "/server/controller/decorator";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/interface/type";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/middle";
import {
  DictionaryAuthorityUtil,
  DictionaryCreator,
  DictionaryFullAuthorityUtil,
  DictionaryModel,
  NormalSearchParameter,
  SearchModeUtil,
  SearchTypeUtil,
  SuggestionCreator,
  WordCreator,
  WordModel
} from "/server/model/dictionary";
import {
  UserCreator,
  UserModel
} from "/server/model/user";
import {
  DetailedDictionary,
  UserDictionary
} from "/server/skeleton/dictionary";
import {
  CustomError
} from "/server/skeleton/error";
import {
  CastUtil
} from "/server/util/cast";
import {
  QueryRange
} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class DictionaryController extends Controller {

  @post(SERVER_PATHS["createDictionary"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"createDictionary">, response: PostResponse<"createDictionary">): Promise<void> {
    let user = request.user!;
    let name = CastUtil.ensureString(request.body.name);
    let dictionary = await DictionaryModel.addEmpty(name, user);
    let body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["uploadDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"uploadDictionary">, response: PostResponse<"uploadDictionary">): Promise<void> {
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

  @post(SERVER_PATHS["deleteDictionary"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"deleteDictionary">, response: PostResponse<"deleteDictionary">): Promise<void> {
    let dictionary = request.dictionary;
    if (dictionary) {
      await dictionary.removeWhole();
      Controller.respond(response, null);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeDictionaryName"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"changeDictionaryName">, response: PostResponse<"changeDictionaryName">): Promise<void> {
    let dictionary = request.dictionary;
    let name = CastUtil.ensureString(request.body.name);
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
  public async [Symbol()](request: PostRequest<"changeDictionaryParamName">, response: PostResponse<"changeDictionaryParamName">): Promise<void> {
    let dictionary = request.dictionary;
    let paramName = CastUtil.ensureString(request.body.paramName);
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

  @post(SERVER_PATHS["deleteDictionaryAuthorizedUser"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"deleteDictionaryAuthorizedUser">, response: PostResponse<"deleteDictionaryAuthorizedUser">): Promise<void> {
    let dictionary = request.dictionary;
    let id = CastUtil.ensureString(request.body.id);
    let user = await UserModel.findById(id);
    if (dictionary) {
      if (user) {
        try {
          await dictionary.deleteAuthorizedUser(user);
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
  public async [Symbol()](request: PostRequest<"changeDictionarySecret">, response: PostResponse<"changeDictionarySecret">): Promise<void> {
    let dictionary = request.dictionary;
    let secret = CastUtil.ensureBoolean(request.body.secret);
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
  public async [Symbol()](request: PostRequest<"changeDictionaryExplanation">, response: PostResponse<"changeDictionaryExplanation">): Promise<void> {
    let dictionary = request.dictionary;
    let explanation = CastUtil.ensureString(request.body.explanation);
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
  public async [Symbol()](request: PostRequest<"changeDictionarySettings">, response: PostResponse<"changeDictionarySettings">): Promise<void> {
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

  @get(SERVER_PATHS["searchDictionary"])
  public async [Symbol()](request: GetRequest<"searchDictionary">, response: GetResponse<"searchDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let search = CastUtil.ensureString(request.query.search);
    let mode = SearchModeUtil.cast(CastUtil.ensureString(request.query.mode));
    let type = SearchTypeUtil.cast(CastUtil.ensureString(request.query.type));
    let offset = CastUtil.ensureNumber(request.query.offset);
    let size = CastUtil.ensureNumber(request.query.size);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let parameter = new NormalSearchParameter(search, mode, type);
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

  @get(SERVER_PATHS["downloadDictionary"])
  public async [Symbol()](request: GetRequest<"downloadDictionary">, response: GetResponse<"downloadDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let fileName = CastUtil.ensureString(request.query.fileName);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let date = new Date();
      let id = date.getTime();
      let path = "./dist/download/" + id + ".json";
      let fullFileName = (fileName || "dictionary") + ".json";
      await dictionary.download(path);
      response.download(path, fullFileName);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @get(SERVER_PATHS["fetchDictionary"])
  public async [Symbol()](request: GetRequest<"fetchDictionary">, response: GetResponse<"fetchDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let paramName = CastUtil.ensureString(request.query.paramName);
    let value = number ?? paramName;
    if (value !== undefined) {
      let dictionary = await DictionaryModel.findOneByValue(value);
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

  @get(SERVER_PATHS["suggestDictionaryTitles"])
  public async [Symbol()](request: GetRequest<"suggestDictionaryTitles">, response: GetResponse<"suggestDictionaryTitles">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let propertyName = CastUtil.ensureString(request.query.propertyName);
    let pattern = CastUtil.ensureString(request.query.pattern);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let titles = await dictionary.suggestTitles(propertyName, pattern);
      let body = titles;
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @get(SERVER_PATHS["fetchDictionaryAuthorizedUsers"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: GetRequest<"fetchDictionaryAuthorizedUsers">, response: GetResponse<"fetchDictionaryAuthorizedUsers">): Promise<void> {
    let dictionary = request.dictionary;
    let authority = DictionaryFullAuthorityUtil.cast(CastUtil.ensureString(request.query.authority));
    if (dictionary) {
      let users = await dictionary.getAuthorizedUsers(authority);
      let body = users.map(UserCreator.create);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @get(SERVER_PATHS["fetchWholeDictionary"])
  public async [Symbol()](request: GetRequest<"fetchWholeDictionary">, response: GetResponse<"fetchWholeDictionary">): Promise<void> {
    let number = CastUtil.ensureNumber(request.query.number);
    let dictionary = await DictionaryModel.findOneByNumber(number);
    if (dictionary) {
      let body = await DictionaryCreator.createDetailed(dictionary);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @get(SERVER_PATHS["fetchDictionaries"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"fetchDictionaries">, response: GetResponse<"fetchDictionaries">): Promise<void> {
    let user = request.user!;
    let dictionaries = await DictionaryModel.findByUser(user, "edit");
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

  @get(SERVER_PATHS["fetchAllDictionaries"])
  public async [Symbol()](request: GetRequest<"fetchAllDictionaries">, response: GetResponse<"fetchAllDictionaries">): Promise<void> {
    let order = CastUtil.ensureString(request.query.order);
    let offset = CastUtil.ensureNumber(request.query.offset);
    let size = CastUtil.ensureNumber(request.query.size);
    let range = new QueryRange(offset, size);
    let hitResult = await DictionaryModel.findPublic(order, range);
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

  @get(SERVER_PATHS["fetchDictionaryAggregation"])
  public async [Symbol()](request: GetRequest<"fetchDictionaryAggregation">, response: GetResponse<"fetchDictionaryAggregation">): Promise<void> {
    let dictionaryCountPromise = DictionaryModel.find().estimatedDocumentCount();
    let wordCountPromise = WordModel.find().estimatedDocumentCount();
    let dictionarySizePromise = DictionaryModel.collection.stats().then((stats) => stats.size);
    let wordSizePromise = WordModel.collection.stats().then((stats) => stats.size);
    let [dictionaryCount, wordCount, dictionarySize, wordSize] = await Promise.all([dictionaryCountPromise, wordCountPromise, dictionarySizePromise, wordSizePromise]);
    let body = {dictionaryCount, wordCount, dictionarySize, wordSize};
    Controller.respond(response, body);
  }

  @get(SERVER_PATHS["checkDictionaryAuthorization"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"checkDictionaryAuthorization">, response: GetResponse<"checkDictionaryAuthorization">): Promise<void> {
    let user = request.user!;
    let number = CastUtil.ensureNumber(request.query.number);
    let authority = DictionaryAuthorityUtil.cast(CastUtil.ensureString(request.query.authority));
    let dictionary = await DictionaryModel.findOneByNumber(number);
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