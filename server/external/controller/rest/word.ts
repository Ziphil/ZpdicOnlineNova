//

import {before, endpoint, restController} from "/server/controller/rest/decorator";
import {FilledRequest, Response} from "/server/external/controller/rest/base";
import {ExternalRestController} from "/server/external/controller/rest/base";
import {checkDictionary, checkMe, limit} from "/server/external/controller/rest/middleware";
import {validateBody, validateQuery} from "/server/external/controller/rest/middleware/validate";
import {WordCreator, WordParameterCreator} from "/server/external/creator";
import {SERVER_PATH_PREFIX} from "/server/external/type/rest";
import {CustomError} from "/server/model";
import {QueryRange} from "/server/util/query";
import {mapWithSizeAsync} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class WordExternalRestController extends ExternalRestController {

  @endpoint("/dictionary/:identifier/words", "get")
  @before(checkMe(), limit(), validateQuery("searchWords"), checkDictionary("view"))
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

  @endpoint("/dictionary/:identifier/word/:wordNumber", "get")
  @before(checkMe(), limit(), validateQuery("fetchWord"), checkDictionary("view"))
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

  @endpoint("/dictionary/:identifier/word", "post")
  @before(checkMe(), limit(), validateBody("addWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"addWord", "me" | "dictionary">, response: Response<"addWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const {word} = request.body;
    try {
      const resultWord = await dictionary.editWord({number: null, ...WordCreator.enflesh(word)}, me);
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

  @endpoint("/dictionary/:identifier/word/:wordNumber", "put")
  @before(checkMe(), limit(), validateBody("editWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"editWord", "me" | "dictionary">, response: Response<"editWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const wordNumber = +request.params.wordNumber;
    const {word} = request.body;
    try {
      const currentWord = await dictionary.fetchOneWordByNumber(wordNumber);
      if (currentWord) {
        const resultWord = await dictionary.editWord({number: currentWord.number, ...WordCreator.enflesh(word)}, me);
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

  @endpoint("/dictionary/:identifier/word/:wordNumber", "delete")
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