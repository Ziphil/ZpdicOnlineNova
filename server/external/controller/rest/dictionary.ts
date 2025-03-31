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
export class DictionaryExternalRestController extends ExternalRestController {

  @endpoint("/v0/dictionary/:identifier/words", "get")
  @before(limit(), checkMe(), validateQuery("searchWords"), checkDictionary())
  public async [Symbol()](request: FilledRequest<"searchWords", "dictionary">, response: Response<"searchWords">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {skip, limit, ...rawParameter} = request.query;
    const parameter = WordParameterCreator.enflesh(rawParameter);
    const range = new QueryRange(skip, limit);
    const hitResult = await dictionary.searchWords(parameter, range);
    const [hitWords, hitSize] = await mapWithSizeAsync(hitResult.words, WordCreator.skeletonizeWithExamples);
    const body = {results: hitWords, total: hitSize};
    response.status(200).json(body).end();
  }

  @endpoint("/v0/dictionary/:identifier/word", "post")
  @before(limit(), checkMe(), validateQuery("addWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"addWord", "me" | "dictionary">, response: Response<"addWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const word = request.body;
    try {
      const resultWord = await dictionary.editWord({number: null, ...word}, me);
      const body = WordCreator.skeletonize(resultWord);
      response.status(201).json(body).end();
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        response.status(409).json({error: "dictionarySaving"}).end();
      } else {
        throw error;
      }
    }
  }

  @endpoint("/v0/dictionary/:identifier/word/:wordNumber", "put")
  @before(limit(), checkMe(), validateQuery("editWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"editWord", "me" | "dictionary">, response: Response<"editWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const wordNumber = +request.params.wordNumber;
    const word = request.body;
    try {
      const currentWord = await dictionary.fetchOneWordByNumber(wordNumber);
      if (currentWord) {
        const resultWord = await dictionary.editWord({number: currentWord.number, ...word}, me);
        const body = WordCreator.skeletonize(resultWord);
        response.status(200).json(body).end();
      } else {
        response.status(404).json({error: "noSuchWord"}).end();
      }
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        response.status(409).json({error: "dictionarySaving"}).end();
      } else {
        throw error;
      }
    }
  }

  @endpoint("/v0/dictionary/:identifier/word/:wordNumber", "delete")
  @before(limit(), checkMe(), validateQuery("discardWord"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"discardWord", "dictionary">, response: Response<"discardWord">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const wordNumber = +request.params.wordNumber;
    try {
      const currentWord = await dictionary.fetchOneWordByNumber(wordNumber);
      if (currentWord) {
        const resultWord = await dictionary.discardWord(wordNumber);
        const body = WordCreator.skeletonize(resultWord);
        response.status(200).json(body).end();
      } else {
        response.status(404).json({error: "noSuchWord"}).end();
      }
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        response.status(409).json({error: "dictionarySaving"}).end();
      } else {
        throw error;
      }
    }
  }

}