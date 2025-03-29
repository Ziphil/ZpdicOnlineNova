//

import {before, get, restController} from "/server/controller/rest/decorator";
import {FilledRequest, Response} from "/server/external/controller/rest/base";
import {checkDictionary} from "/server/external/controller/rest/middleware/dictionary";
import {WordParameterCreator} from "/server/external/creator";
import {SERVER_PATH_PREFIX} from "/server/external/type/rest";
import {WordCreator} from "/server/internal/creator";
import {QueryRange} from "/server/util/query";
import {mapWithSizeAsync} from "/server/util/with-size";
import {ExternalRestController} from "./base";


@restController(SERVER_PATH_PREFIX)
export class DebugExternalRestController extends ExternalRestController {

  @get("/v0/debug")
  @before(checkDictionary())
  public async [Symbol()](request: FilledRequest<"debug", "dictionary">, response: Response<"debug">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {skip, limit, ...rawParameter} = request.query;
    const parameter = WordParameterCreator.enflesh(rawParameter);
    const range = new QueryRange(skip, limit);
    const hitResult = await dictionary.searchWords(parameter, range);
    const [hitWords, hitSize] = await mapWithSizeAsync(hitResult.words, WordCreator.skeletonizeWithExamples);
    const body = {results: hitWords, total: hitSize};
    ExternalRestController.respond(response, body);
  }

}