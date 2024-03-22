//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, FilledMiddlewareBody, Request, Response} from "/server/controller/internal/controller";
import {checkDictionary, checkMe, checkRecaptcha, parseMe} from "/server/controller/internal/middleware";
import {DictionaryCreator, DictionaryParameterCreator, SuggestionCreator, UserCreator, WordCreator, WordParameterCreator} from "/server/creator";
import {DictionaryModel, ExampleModel, UserModel, WordModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {sanitizeFileName} from "/server/util/misc";
import {QueryRange} from "/server/util/query";
import {mapWithSizeAsync} from "/server/util/with-size";
import {agenda} from "/worker/agenda";


@controller(SERVER_PATH_PREFIX)
export class DictionaryController extends Controller {

  @post("/createDictionary")
  @before(checkMe())
  public async [Symbol()](request: Request<"createDictionary">, response: Response<"createDictionary">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {name} = request.body;
    const dictionary = await DictionaryModel.addEmpty(name, me);
    const body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post("/uploadDictionary")
  @before(checkRecaptcha(), checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"uploadDictionary">, response: Response<"uploadDictionary">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const file = request.file;
    if (file !== undefined) {
      const path = file.path;
      const originalPath = file.originalname;
      if (file.size <= 5 * 1024 * 1024) {
        const number = dictionary.number;
        await agenda.now("uploadDictionary", {number, path, originalPath});
        const body = DictionaryCreator.create(dictionary);
        Controller.respond(response, body);
      } else {
        Controller.respondError(response, "dictionarySizeTooLarge");
      }
    } else {
      Controller.respondError(response, "invalidArgument");
    }
  }

  @post("/discardDictionary")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"discardDictionary">, response: Response<"discardDictionary">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    await dictionary.discard();
    Controller.respond(response, null);
  }

  @post("/changeDictionaryName")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryName">, response: Response<"changeDictionaryName">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {name} = request.body;
    await dictionary.changeName(name);
    const body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post("/changeDictionaryParamName")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryParamName">, response: Response<"changeDictionaryParamName">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {paramName} = request.body;
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
  }

  @post("/discardDictionaryAuthorizedUser")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"discardDictionaryAuthorizedUser">, response: Response<"discardDictionaryAuthorizedUser">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {id} = request.body;
    const user = await UserModel.findById(id);
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
  }

  @post("/changeDictionarySecret")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySecret">, response: Response<"changeDictionarySecret">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {secret} = request.body;
    await dictionary.changeSecret(secret);
    const body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post("/changeDictionaryExplanation")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionaryExplanation">, response: Response<"changeDictionaryExplanation">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {explanation} = request.body;
    await dictionary.changeExplanation(explanation);
    const body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post("/changeDictionarySettings")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"changeDictionarySettings">, response: Response<"changeDictionarySettings">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {settings} = request.body;
    await dictionary.changeSettings(settings);
    const body = DictionaryCreator.create(dictionary);
    Controller.respond(response, body);
  }

  @post("/searchDictionary")
  public async [Symbol()](request: Request<"searchDictionary">, response: Response<"searchDictionary">): Promise<void> {
    const {offset, size} = request.body;
    const parameter = DictionaryParameterCreator.recreate(request.body.parameter);
    const range = new QueryRange(offset, size);
    const hitResult = await DictionaryModel.search(parameter, range);
    const body = await mapWithSizeAsync(hitResult, DictionaryCreator.createDetailed);
    Controller.respond(response, body);
  }

  @post("/searchWord")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"searchWord">, response: Response<"searchWord">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {offset, size} = request.body;
    const parameter = WordParameterCreator.recreate(request.body.parameter);
    const range = new QueryRange(offset, size);
    const hitResult = await dictionary.searchWord(parameter, range);
    const body = {
      words: await mapWithSizeAsync(hitResult.words, WordCreator.createDetailed),
      suggestions: hitResult.suggestions.map(SuggestionCreator.create)
    };
    Controller.respond(response, body);
  }

  @post("/downloadDictionary")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"downloadDictionary">, response: Response<"downloadDictionary">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {fileName} = request.body;
    const date = new Date();
    const path = "./dist/download/" + date.getTime() + ".json";
    const fullFileName = sanitizeFileName(fileName || dictionary.name) + ".json";
    await dictionary.download(path);
    response.download(path, fullFileName);
  }

  @post("/fetchDictionary")
  public async [Symbol()](request: Request<"fetchDictionary">, response: Response<"fetchDictionary">): Promise<void> {
    const {identifier} = request.body;
    const dictionary = await DictionaryModel.fetchOneByIdentifier(identifier);
    if (dictionary) {
      const body = await DictionaryCreator.createDetailed(dictionary);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchWordSize")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchWordSize">, response: Response<"fetchWordSize">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const body = await dictionary.countWords();
    Controller.respond(response, body);
  }

  @post("/fetchWordNameFrequencies")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchWordNameFrequencies">, response: Response<"fetchWordNameFrequencies">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const body = await dictionary.calcWordNameFrequencies();
    Controller.respond(response, body);
  }

  @post("/fetchDictionaryStatistics")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchDictionaryStatistics">, response: Response<"fetchDictionaryStatistics">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const body = await dictionary.calcStatistics();
    Controller.respond(response, body);
  }

  @post("/suggestDictionaryTitles")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"suggestDictionaryTitles">, response: Response<"suggestDictionaryTitles">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {propertyName, pattern} = request.body;
    const titles = await dictionary.suggestTitles(propertyName, pattern);
    const body = titles;
    Controller.respond(response, body);
  }

  @post("/fetchDictionaryAuthorizedUsers")
  @before(checkMe(), checkDictionary())
  public async [Symbol()](request: Request<"fetchDictionaryAuthorizedUsers">, response: Response<"fetchDictionaryAuthorizedUsers">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {authority} = request.body;
    const users = await dictionary.fetchAuthorizedUsers(authority);
    const body = users.map(UserCreator.create);
    Controller.respond(response, body);
  }

  @post("/fetchUserDictionaries")
  @before(parseMe())
  public async [Symbol()](request: Request<"fetchUserDictionaries">, response: Response<"fetchUserDictionaries">): Promise<void> {
    const {me} = request.middlewareBody;
    const {name} = request.body;
    const user = await UserModel.fetchOneByName(name);
    if (user) {
      const authority = (me?.id === user.id) ? "edit" : "own";
      const includeSecret = me?.id === user.id;
      const dictionaries = await DictionaryModel.fetchByUser(user, authority, includeSecret);
      const body = await Promise.all(dictionaries.map((dictionary) => DictionaryCreator.createUser(dictionary, user)));
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchUser");
    }
  }

  @post("/fetchOverallAggregation")
  public async [Symbol()](request: Request<"fetchOverallAggregation">, response: Response<"fetchOverallAggregation">): Promise<void> {
    const models = [DictionaryModel, WordModel, ExampleModel, UserModel] as Array<any>;
    const [dictionary, word, example, user] = await Promise.all(models.map(async (model) => {
      if (model === UserModel) {
        const [count, {size}] = await Promise.all([model.estimatedDocumentCount(), model.collection.stats()]);
        return {count, wholeCount: count, size};
      } else {
        const [count, wholeCount, {size}] = await Promise.all([model.findExist().countDocuments(), model.estimatedDocumentCount(), model.collection.stats()]);
        return {count, wholeCount, size};
      }
    }));
    const body = {dictionary, word, example, user};
    Controller.respond(response, body);
  }

  @post("/fetchDictionaryAuthorization")
  @before(parseMe(), checkDictionary())
  public async [Symbol()](request: Request<"fetchDictionaryAuthorization">, response: Response<"fetchDictionaryAuthorization">): Promise<void> {
    const {me, dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {authority} = request.body;
    if (me) {
      const hasAuthority = await dictionary.hasAuthority(me, authority);
      const body = hasAuthority;
      Controller.respond(response, body);
    } else {
      Controller.respond(response, false);
    }
  }

  @post("/checkDictionaryAuthorization")
  @before(checkMe(), checkDictionary())
  public async [Symbol()](request: Request<"checkDictionaryAuthorization">, response: Response<"checkDictionaryAuthorization">): Promise<void> {
    const {me, dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {authority} = request.body;
    const hasAuthority = await dictionary.hasAuthority(me, authority);
    if (hasAuthority) {
      Controller.respond(response, null);
    } else {
      Controller.respondForbiddenError(response);
    }
  }

}