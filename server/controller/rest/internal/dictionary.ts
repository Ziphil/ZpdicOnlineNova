//

import dayjs from "dayjs";
import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledRequest, InternalRestController, Request, Response} from "/server/controller/rest/internal/controller";
import {checkDictionary, checkMe, checkRecaptcha, parseMe} from "/server/controller/rest/internal/middleware";
import {DictionaryCreator, DictionaryParameterCreator, SuggestionCreator, UserCreator, WordCreator, WordParameterCreator} from "/server/creator";
import {DictionaryModel, ExampleModel, UserModel, WordModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";
import {SOCKET_PATH_PREFIX} from "/server/type/socket/internal";
import {sanitizeFileName} from "/server/util/misc";
import {QueryRange} from "/server/util/query";
import {mapWithSizeAsync} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX, SOCKET_PATH_PREFIX)
export class DictionaryRestController extends InternalRestController {

  @post("/createDictionary")
  @before(checkMe())
  public async [Symbol()](request: FilledRequest<"createDictionary", "me">, response: Response<"createDictionary">): Promise<void> {
    const {me} = request.middlewareBody ;
    const {name} = request.body;
    const dictionary = await DictionaryModel.addEmpty(name, me);
    const body = DictionaryCreator.create(dictionary);
    InternalRestController.respond(response, body);
  }

  @post("/uploadDictionary")
  @before(checkRecaptcha(), checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"uploadDictionary", "me" | "dictionary">, response: Response<"uploadDictionary">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const file = request.file;
    if (file !== undefined) {
      const path = file.path;
      const originalPath = file.originalname;
      if (file.size <= 5 * 1024 * 1024) {
        const number = dictionary.number;
        await this.agenda.now("uploadDictionary", {number, path, originalPath});
        this.agenda.on("success:uploadDictionary", (job) => {
          this.namespace?.to(`uploadDictionary.${number}`).emit("succeedUploadDictionary", {number});
          this.namespace?.socketsLeave(`uploadDictionary.${number}`);
        });
        this.agenda.on("fail:uploadDictionary", (job) => {
          this.namespace?.to(`uploadDictionary.${number}`).emit("failUploadDictionary", {number});
          this.namespace?.socketsLeave(`uploadDictionary.${number}`);
        });
        const body = DictionaryCreator.create(dictionary);
        InternalRestController.respond(response, body);
      } else {
        InternalRestController.respondError(response, "dictionarySizeTooLarge");
      }
    } else {
      InternalRestController.respondError(response, "invalidArgument");
    }
  }

  @post("/discardDictionary")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"discardDictionary", "me" | "dictionary">, response: Response<"discardDictionary">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    await dictionary.discard();
    InternalRestController.respond(response, null);
  }

  @post("/changeDictionaryName")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"changeDictionaryName", "me" | "dictionary">, response: Response<"changeDictionaryName">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {name} = request.body;
    await dictionary.changeName(name);
    const body = DictionaryCreator.create(dictionary);
    InternalRestController.respond(response, body);
  }

  @post("/changeDictionaryParamName")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"changeDictionaryParamName", "me" | "dictionary">, response: Response<"changeDictionaryParamName">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {paramName} = request.body;
    try {
      await dictionary.changeParamName(paramName);
      const body = DictionaryCreator.create(dictionary);
      InternalRestController.respond(response, body);
    } catch (error) {
      if (error.name === "ValidationError") {
        if (error.errors.paramName) {
          InternalRestController.respondError(response, "invalidDictionaryParamName");
        } else {
          throw error;
        }
      } else {
        InternalRestController.respondByCustomError(response, ["duplicateDictionaryParamName"], error);
      }
    }
  }

  @post("/discardDictionaryAuthorizedUser")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"discardDictionaryAuthorizedUser", "me" | "dictionary">, response: Response<"discardDictionaryAuthorizedUser">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {id} = request.body;
    const user = await UserModel.findById(id);
    if (user) {
      try {
        await dictionary.discardAuthorizedUser(user);
        InternalRestController.respond(response, null);
      } catch (error) {
        InternalRestController.respondByCustomError(response, ["noSuchDictionaryAuthorizedUser"], error);
      }
    } else {
      InternalRestController.respondError(response, "noSuchDictionaryAuthorizedUser");
    }
  }

  @post("/changeDictionarySecret")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"changeDictionarySecret", "me" | "dictionary">, response: Response<"changeDictionarySecret">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {secret} = request.body;
    await dictionary.changeSecret(secret);
    const body = DictionaryCreator.create(dictionary);
    InternalRestController.respond(response, body);
  }

  @post("/changeDictionaryExplanation")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"changeDictionaryExplanation", "me" | "dictionary">, response: Response<"changeDictionaryExplanation">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {explanation} = request.body;
    await dictionary.changeExplanation(explanation);
    const body = DictionaryCreator.create(dictionary);
    InternalRestController.respond(response, body);
  }

  @post("/changeDictionarySettings")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: FilledRequest<"changeDictionarySettings", "me" | "dictionary">, response: Response<"changeDictionarySettings">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {settings} = request.body;
    await dictionary.changeSettings(settings);
    const body = DictionaryCreator.create(dictionary);
    InternalRestController.respond(response, body);
  }

  @post("/searchDictionary")
  public async [Symbol()](request: Request<"searchDictionary">, response: Response<"searchDictionary">): Promise<void> {
    const {offset, size} = request.body;
    const parameter = DictionaryParameterCreator.recreate(request.body.parameter);
    const range = new QueryRange(offset, size);
    const hitResult = await DictionaryModel.search(parameter, range);
    const body = await mapWithSizeAsync(hitResult, DictionaryCreator.createDetailed);
    InternalRestController.respond(response, body);
  }

  @post("/searchWord")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"searchWord", "dictionary">, response: Response<"searchWord">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {offset, size} = request.body;
    const parameter = WordParameterCreator.recreate(request.body.parameter);
    const range = new QueryRange(offset, size);
    const hitResult = await dictionary.searchWord(parameter, range);
    const body = {
      words: await mapWithSizeAsync(hitResult.words, WordCreator.createDetailed),
      suggestions: hitResult.suggestions.map(SuggestionCreator.create)
    };
    InternalRestController.respond(response, body);
  }

  @post("/downloadDictionary")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"downloadDictionary", "dictionary">, response: Response<"downloadDictionary">): Promise<void> {
    const {dictionary} = request.middlewareBody ;
    const number = dictionary.number;
    const key = dayjs().valueOf().toString();
    const path = `./dist/download/${key}.json`;
    await this.agenda.now("downloadDictionary", {number, key, path});
    this.agenda.on("success:downloadDictionary", (job) => {
      this.namespace?.to(`downloadDictionary.${number}`).emit("succeedDownloadDictionary", {number, key});
      this.namespace?.socketsLeave(`downloadDictionary.${number}`);
    });
    this.agenda.on("fail:downloadDictionary", (job) => {
      this.namespace?.to(`downloadDictionary.${number}`).emit("failDownloadDictionary", {number});
      this.namespace?.socketsLeave(`downloadDictionary.${number}`);
    });
    const body = {key};
    InternalRestController.respond(response, body);
  }

  @post("/downloadDictionaryFile")
  public async [Symbol()](request: Request<"downloadDictionaryFile">, response: Response<"downloadDictionaryFile">): Promise<void> {
    const {key, fileName} = request.body;
    const path = `./dist/download/${key}.json`;
    const fullFileName = sanitizeFileName(fileName || key) + ".json";
    response.download(path, fullFileName);
  }

  @post("/fetchDictionary")
  public async [Symbol()](request: Request<"fetchDictionary">, response: Response<"fetchDictionary">): Promise<void> {
    const {identifier} = request.body;
    const dictionary = await DictionaryModel.fetchOneByIdentifier(identifier);
    if (dictionary) {
      const body = await DictionaryCreator.createDetailed(dictionary);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchDictionarySizes")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"fetchDictionarySizes", "dictionary">, response: Response<"fetchDictionarySizes">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const [wordCount, exampleCount] = await Promise.all([dictionary.countWords(), dictionary.countExamples()]);
    const body = {word: wordCount, example: exampleCount};
    InternalRestController.respond(response, body);
  }

  @post("/fetchWordNameFrequencies")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"fetchWordNameFrequencies", "dictionary">, response: Response<"fetchWordNameFrequencies">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const body = await dictionary.calcWordNameFrequencies();
    InternalRestController.respond(response, body);
  }

  @post("/fetchDictionaryStatistics")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"fetchDictionaryStatistics", "dictionary">, response: Response<"fetchDictionaryStatistics">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const body = await dictionary.calcStatistics();
    InternalRestController.respond(response, body);
  }

  @post("/suggestDictionaryTitles")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"suggestDictionaryTitles", "dictionary">, response: Response<"suggestDictionaryTitles">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {propertyName, pattern} = request.body;
    const titles = await dictionary.suggestTitles(propertyName, pattern);
    const body = titles;
    InternalRestController.respond(response, body);
  }

  @post("/fetchDictionaryAuthorizedUsers")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"fetchDictionaryAuthorizedUsers", "dictionary">, response: Response<"fetchDictionaryAuthorizedUsers">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {authority} = request.body;
    const users = await dictionary.fetchAuthorizedUsers(authority);
    const body = users.map(UserCreator.create);
    InternalRestController.respond(response, body);
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
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchUser");
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
    InternalRestController.respond(response, body);
  }

  @post("/fetchDictionaryAuthorization")
  @before(parseMe(), checkDictionary())
  public async [Symbol()](request: FilledRequest<"fetchDictionaryAuthorization", "dictionary">, response: Response<"fetchDictionaryAuthorization">): Promise<void> {
    const {me, dictionary} = request.middlewareBody ;
    const {authority} = request.body;
    if (me) {
      const hasAuthority = await dictionary.hasAuthority(me, authority);
      const body = hasAuthority;
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respond(response, false);
    }
  }

  @post("/checkDictionaryAuthorization")
  @before(checkMe(), checkDictionary())
  public async [Symbol()](request: FilledRequest<"checkDictionaryAuthorization", "me" | "dictionary">, response: Response<"checkDictionaryAuthorization">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const {authority} = request.body;
    const hasAuthority = await dictionary.hasAuthority(me, authority);
    if (hasAuthority) {
      InternalRestController.respond(response, null);
    } else {
      InternalRestController.respondForbiddenError(response);
    }
  }

}