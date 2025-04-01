//

import {before, endpoint, restController} from "/server/controller/rest/decorator";
import {FilledRequest, Response} from "/server/external/controller/rest/base";
import {checkDictionary, checkMe, limit} from "/server/external/controller/rest/middleware";
import {validateQuery} from "/server/external/controller/rest/middleware/validate";
import {ExampleCreator} from "/server/external/creator";
import {SERVER_PATH_PREFIX} from "/server/external/type/rest";
import {CustomError, NormalExampleParameter} from "/server/model";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";
import {ExternalRestController} from "./base";


@restController(SERVER_PATH_PREFIX)
export class ExampleExternalRestController extends ExternalRestController {

  @endpoint("/v0/dictionary/:identifier/examples", "get")
  @before(limit(), checkMe(), validateQuery("searchExamples"), checkDictionary())
  public async [Symbol()](request: FilledRequest<"searchExamples", "dictionary">, response: Response<"searchExamples">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {skip, limit} = request.query;
    const parameter = new NormalExampleParameter();
    const range = new QueryRange(skip, limit);
    const hitResult = await dictionary.searchExamples(parameter, range);
    const [hitExamples, hitSize] = mapWithSize(hitResult, ExampleCreator.skeletonize);
    const body = {examples: hitExamples, total: hitSize};
    ExternalRestController.respond(response, 200, body);
  }

  @endpoint("/v0/dictionary/:identifier/example", "post")
  @before(limit(), checkMe(), validateQuery("addExample"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"addExample", "me" | "dictionary">, response: Response<"addExample">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const {example} = request.body;
    try {
      const resultExample = await dictionary.editExample({number: null, ...example}, me);
      const body = {example: ExampleCreator.skeletonize(resultExample)};
      ExternalRestController.respond(response, 201, body);
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        ExternalRestController.respond(response, 409, {error: "dictionarySaving"});
      } else {
        throw error;
      }
    }
  }

  @endpoint("/v0/dictionary/:identifier/example/:exampleNumber", "put")
  @before(limit(), checkMe(), validateQuery("editExample"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"editExample", "me" | "dictionary">, response: Response<"editExample">): Promise<void> {
    const {me, dictionary} = request.middlewareBody;
    const exampleNumber = +request.params.exampleNumber;
    const {example} = request.body;
    try {
      const currentExample = await dictionary.fetchOneExampleByNumber(exampleNumber);
      if (currentExample) {
        const resultExample = await dictionary.editExample({number: currentExample.number, ...example}, me);
        const body = {example: ExampleCreator.skeletonize(resultExample)};
        ExternalRestController.respond(response, 200, body);
      } else {
        ExternalRestController.respond(response, 404, {error: "noSuchExample"});
      }
    } catch (error) {
      if (CustomError.isCustomError(error, "dictionarySaving")) {
        ExternalRestController.respond(response, 409, {error: "dictionarySaving"});
      } else {
        throw error;
      }
    }
  }

  @endpoint("/v0/dictionary/:identifier/example/:exampleNumber", "delete")
  @before(limit(), checkMe(), validateQuery("discardExample"), checkDictionary("edit"))
  public async [Symbol()](request: FilledRequest<"discardExample", "dictionary">, response: Response<"discardExample">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const exampleNumber = +request.params.exampleNumber;
    try {
      const currentExample = await dictionary.fetchOneExampleByNumber(exampleNumber);
      if (currentExample) {
        const resultExample = await dictionary.discardExample(exampleNumber);
        const body = {example: ExampleCreator.skeletonize(resultExample)};
        ExternalRestController.respond(response, 200, body);
      } else {
        ExternalRestController.respond(response, 404, {error: "noSuchExample"});
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