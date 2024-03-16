//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {checkUser, verifyDictionary, verifyRecaptcha, verifyUser} from "/server/controller/internal/middle";
import {DictionaryCreator, DictionaryParameterCreator, SuggestionCreator, UserCreator, WordCreator, WordParameterCreator} from "/server/creator";
import {DictionaryModel, ExampleModel, UserModel, WordModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {sanitizeFileName} from "/server/util/misc";
import {QueryRange} from "/server/util/query";
import {agenda} from "/worker/agenda";


@controller(SERVER_PATH_PREFIX)
export class DictionaryController extends Controller {

  @post("/createDictionary")
  @before(verifyUser())
  public async [Symbol()](request: Request<"createDictionary">, response: Response<"createDictionary">): Promise<void> {
    const user = request.user!;
    const name = request.body.name;
    const dictionary = await DictionaryModel.addEmpty(name, user);
    const body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post("/uploadDictionary")
  @before(verifyRecaptcha(), verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"uploadDictionary">, response: Response<"uploadDictionary">): Promise<void> {
    const dictionary = request.dictionary;
    const path = request.file!.path;
    const originalPath = request.file!.originalname;
    if (dictionary) {
      if (request.file!.size <= 5 * 1024 * 1024) {
        const number = dictionary.number;
        agenda.now("uploadDictionary", {number, path, originalPath});
        const body = DictionaryCreator.create(dictionary);
        Controller.respond(response, body);
      } else {
        Controller.respondError(response, "dictionarySizeTooLarge");
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/discardDictionary")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"discardDictionary">, response: Response<"discardDictionary">): Promise<void> {
    const dictionary = request.dictionary;
    if (dictionary) {
      await dictionary.discard();
      Controller.respond(response, null);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/changeDictionaryName")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryName">, response: Response<"changeDictionaryName">): Promise<void> {
    const dictionary = request.dictionary;
    const name = request.body.name;
    if (dictionary) {
      await dictionary.changeName(name);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/changeDictionaryParamName")
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
        if (error.name === "ValidationError") {
          if (error.errors.paramName) {
            Controller.respondError(response, "invalidDictionaryParamName");
          } else {
            throw error;
          }
        } else {
          Controller.respondByCustomError(response, ["duplicateDictionaryParamName"], error);
        }
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/discardDictionaryAuthorizedUser")
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
          Controller.respondByCustomError(response, ["noSuchDictionaryAuthorizedUser"], error);
        }
      } else {
        Controller.respondError(response, "noSuchDictionaryAuthorizedUser");
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/changeDictionarySecret")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySecret">, response: Response<"changeDictionarySecret">): Promise<void> {
    const dictionary = request.dictionary;
    const secret = request.body.secret;
    if (dictionary) {
      await dictionary.changeSecret(secret);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/changeDictionaryExplanation")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryExplanation">, response: Response<"changeDictionaryExplanation">): Promise<void> {
    const dictionary = request.dictionary;
    const explanation = request.body.explanation;
    if (dictionary) {
      await dictionary.changeExplanation(explanation);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/changeDictionarySettings")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySettings">, response: Response<"changeDictionarySettings">): Promise<void> {
    const dictionary = request.dictionary;
    const settings = request.body.settings;
    if (dictionary) {
      await dictionary.changeSettings(settings);
      const body = DictionaryCreator.create(dictionary);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/searchDictionary")
  public async [Symbol()](request: Request<"searchDictionary">, response: Response<"searchDictionary">): Promise<void> {
    const parameter = DictionaryParameterCreator.recreate(request.body.parameter);
    const offset = request.body.offset;
    const size = request.body.size;
    const range = new QueryRange(offset, size);
    const hitResult = await DictionaryModel.search(parameter, range);
    const hitDictionaries = await Promise.all(hitResult[0].map((hitDictionary) => DictionaryCreator.createDetailed(hitDictionary)));
    const hitSize = hitResult[1];
    const body = [hitDictionaries, hitSize] as any;
    Controller.respond(response, body);
  }

  @post("/searchWord")
  public async [Symbol()](request: Request<"searchWord">, response: Response<"searchWord">): Promise<void> {
    const number = request.body.number;
    const parameter = WordParameterCreator.recreate(request.body.parameter);
    const offset = request.body.offset;
    const size = request.body.size;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const range = new QueryRange(offset, size);
      const hitResult = await dictionary.searchWord(parameter, range);
      const hitWords = await Promise.all(hitResult.words[0].map(WordCreator.createDetailed));
      const hitSize = hitResult.words[1];
      const hitSuggestions = hitResult.suggestions.map(SuggestionCreator.create);
      const body = {words: [hitWords, hitSize], suggestions: hitSuggestions} as any;
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/downloadDictionary")
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
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchDictionary")
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
        Controller.respondError(response, "noSuchDictionaryNumber");
      }
    } else {
      Controller.respondError(response, "invalidArgument");
    }
  }

  @post("/fetchWordSize")
  public async [Symbol()](request: Request<"fetchWordSize">, response: Response<"fetchWordSize">): Promise<void> {
    const number = request.body.number;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const body = await dictionary.countWords();
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchWordNameFrequencies")
  public async [Symbol()](request: Request<"fetchWordNameFrequencies">, response: Response<"fetchWordNameFrequencies">): Promise<void> {
    const number = request.body.number;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const body = await dictionary.calcWordNameFrequencies();
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchDictionaryStatistics")
  public async [Symbol()](request: Request<"fetchDictionaryStatistics">, response: Response<"fetchDictionaryStatistics">): Promise<void> {
    const number = request.body.number;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const body = await dictionary.calcStatistics();
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/suggestDictionaryTitles")
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
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchDictionaryAuthorizedUsers")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchDictionaryAuthorizedUsers">, response: Response<"fetchDictionaryAuthorizedUsers">): Promise<void> {
    const dictionary = request.dictionary;
    const authority = request.body.authority;
    if (dictionary) {
      const users = await dictionary.fetchAuthorizedUsers(authority);
      const body = users.map(UserCreator.create);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchDictionaries")
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchDictionaries">, response: Response<"fetchDictionaries">): Promise<void> {
    const user = request.user!;
    const dictionaries = await DictionaryModel.fetchByUser(user, "edit");
    const body = await Promise.all(dictionaries.map(async (dictionary) => {
      const skeleton = await DictionaryCreator.createUser(dictionary, user);
      return skeleton;
    }));
    Controller.respond(response, body);
  }

  @post("/fetchUserDictionaries")
  @before(checkUser())
  public async [Symbol()](request: Request<"fetchUserDictionaries">, response: Response<"fetchUserDictionaries">): Promise<void> {
    const me = request.user;
    const name = request.body.name;
    const user = await UserModel.fetchOneByName(name);
    if (user) {
      const authority = (me?.id === user.id) ? "edit" : "own";
      const includeSecret = me?.id === user.id;
      const dictionaries = await DictionaryModel.fetchByUser(user, authority, includeSecret);
      const body = await Promise.all(dictionaries.map(async (dictionary) => {
        const skeleton = await DictionaryCreator.createUser(dictionary, user);
        return skeleton;
      }));
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchUser");
    }
  }

  @post("/fetchAllDictionaries")
  public async [Symbol()](request: Request<"fetchAllDictionaries">, response: Response<"fetchAllDictionaries">): Promise<void> {
    const order = request.body.order;
    const offset = request.body.offset;
    const size = request.body.size;
    const range = new QueryRange(offset, size);
    const hitResult = await DictionaryModel.fetch(order, range);
    const hitDictionaries = await Promise.all(hitResult[0].map(async (hitDictionary) => {
      const skeleton = await DictionaryCreator.createDetailed(hitDictionary);
      return skeleton;
    }));
    const hitSize = hitResult[1];
    const body = [hitDictionaries, hitSize] as any;
    Controller.respond(response, body);
  }

  @post("/fetchOverallAggregation")
  public async [Symbol()](request: Request<"fetchOverallAggregation">, response: Response<"fetchOverallAggregation">): Promise<void> {
    const models = [DictionaryModel, WordModel, ExampleModel, UserModel] as Array<any>;
    const [dictionary, word, example, user] = await Promise.all(models.map((model) => {
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
    }));
    const body = {dictionary, word, example, user};
    Controller.respond(response, body);
  }

  @post("/fetchDictionaryAuthorization")
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
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/checkDictionaryAuthorization")
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
        Controller.respondForbiddenError(response);
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

}