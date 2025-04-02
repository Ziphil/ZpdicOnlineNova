//

import {before, endpoint, restController} from "/server/controller/rest/decorator";
import {FilledRequest, Response} from "/server/external/controller/rest/base";
import {checkDictionary, checkMe, limit} from "/server/external/controller/rest/middleware";
import {validateQuery} from "/server/external/controller/rest/middleware/validate";
import {WordParameterCreator} from "/server/external/creator";
import {WordCreator} from "/server/external/creator";
import {SERVER_PATH_PREFIX} from "/server/external/type/rest";
import {CustomError} from "/server/model";
import {QueryRange} from "/server/util/query";
import {mapWithSizeAsync} from "/server/util/with-size";
import {ExternalRestController} from "./base";


@restController(SERVER_PATH_PREFIX)
export class WordExternalRestController extends ExternalRestController {

  @endpoint("/v0/dictionary/:identifier/words", "get")
  @before(checkMe(), limit(), validateQuery("searchWords"), checkDictionary())
  public async [Symbol()](request: FilledRequest<"searchWords", "dictionary">, response: Response<"searchWords">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {skip, limit, ...rawParameter} = request.query;
    const parameter = WordParameterCreator.enflesh(rawParameter);
    const range = new QueryRange(skip, limit);
    const hitResult = await dictionary.searchWords(parameter, range);
    const [hitWords, hitSize] = await mapWithSizeAsync(hitResult.words, WordCreator.skeletonizeWithExamples);
    const body = {words: hitWords, total: hitSize};
    ExternalRestController.respond(response, 200, body);
  }

  @endpoint("/v0/dictionary/:identifier/word/:wordNumber", "get")
  @before(checkMe(), limit(), validateQuery("fetchWord"), checkDictionary())
  public async [Symbol()](request: FilledRequest<"fetchWord", "dictionary">, response: Response<"fetchWord">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const wordNumber = +request.params.wordNumber;
    const word = await dictionary.fetchOneWordByNumber(wordNumber);
    if (word) {
      const body = {word: await WordCreator.skeletonizeWithExamples(word)};
      ExternalRestController.respond(response, 200, body);
    } else {
      ExternalRestController.respond(response, 404, {error: "noSuchWord"});
    }
  }

  @endpoint("/v0/dictionary/:identifier/word", "post")
  @before(checkMe(), limit(), validateQuery("addWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"addWord", "me" | "dictionary">, response: Response<"addWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const {word} = request.body;
    try {
      const resultWord = await dictionary.editWord({number: null, ...word}, me);
      const body = {word: WordCreator.skeletonize(resultWord)};
      ExternalRestController.respond(response, 201, body);
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        ExternalRestController.respond(response, 409, {error: "dictionarySaving"});
      } else {
        throw error;
      }
    }
  }

  @endpoint("/v0/dictionary/:identifier/word/:wordNumber", "put")
  @before(checkMe(), limit(), validateQuery("editWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"editWord", "me" | "dictionary">, response: Response<"editWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const wordNumber = +request.params.wordNumber;
    const {word} = request.body;
    try {
      const currentWord = await dictionary.fetchOneWordByNumber(wordNumber);
      if (currentWord) {
        const resultWord = await dictionary.editWord({number: currentWord.number, ...word}, me);
        const body = {word: WordCreator.skeletonize(resultWord)};
        ExternalRestController.respond(response, 200, body);
      } else {
        ExternalRestController.respond(response, 404, {error: "noSuchWord"});
      }
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        ExternalRestController.respond(response, 409, {error: "dictionarySaving"});
      } else {
        throw error;
      }
    }
  }

  @endpoint("/v0/dictionary/:identifier/word/:wordNumber", "delete")
  @before(checkMe(), limit(), validateQuery("discardWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"discardWord", "dictionary">, response: Response<"discardWord">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const wordNumber = +request.params.wordNumber;
    try {
      const currentWord = await dictionary.fetchOneWordByNumber(wordNumber);
      if (currentWord) {
        const resultWord = await dictionary.discardWord(wordNumber);
        const body = {word: WordCreator.skeletonize(resultWord)};
        ExternalRestController.respond(response, 200, body);
      } else {
        ExternalRestController.respond(response, 404, {error: "noSuchWord"});
      }
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        ExternalRestController.respond(response, 409, {error: "dictionarySaving"});
      } else {
        throw error;
      }
    }
  }

}