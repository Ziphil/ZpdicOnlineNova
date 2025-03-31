//

import {before, get, restController} from "/server/controller/rest/decorator";
import {FilledRequest, Response} from "/server/external/controller/rest/base";
import {checkDictionary, checkMe, limit} from "/server/external/controller/rest/middleware";
import {validateQuery} from "/server/external/controller/rest/middleware/validate";
import {WordParameterCreator} from "/server/external/creator";
import {WordCreator} from "/server/external/creator";
import {SERVER_PATH_PREFIX} from "/server/external/type/rest";
import {QueryRange} from "/server/util/query";
import {mapWithSizeAsync} from "/server/util/with-size";
import {ExternalRestController} from "./base";


@restController(SERVER_PATH_PREFIX)
export class DictionaryExternalRestController extends ExternalRestController {

  @get("/v0/dictionary/:identifier/word-search")
  @before(checkMe(), limit(), validateQuery("searchWords"), checkDictionary())
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

}