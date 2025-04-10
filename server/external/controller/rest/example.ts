//

import {before, endpoint, restController} from "/server/controller/rest/decorator";
import {FilledRequest, Request, Response} from "/server/external/controller/rest/base";
import {checkDictionary, checkMe, limit} from "/server/external/controller/rest/middleware";
import {validateBody, validateQuery} from "/server/external/controller/rest/middleware/validate";
import {ExampleCreator, ExampleOfferCreator, ExampleOfferParameterCreator} from "/server/external/creator";
import {ExampleParameterCreator} from "/server/external/creator";
import {SERVER_PATH_PREFIX} from "/server/external/type/rest";
import {CustomError, ExampleOfferModel} from "/server/model";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";
import {ExternalRestController} from "./base";


@restController(SERVER_PATH_PREFIX)
export class ExampleExternalRestController extends ExternalRestController {

  @endpoint("/v0/dictionary/:identifier/examples", "get")
  @before(checkMe(), limit(), validateQuery("searchExamples"), checkDictionary())
  public async [Symbol()](request: FilledRequest<"searchExamples", "dictionary">, response: Response<"searchExamples">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {skip, limit, ...rawParameter} = request.query;
    const parameter = ExampleParameterCreator.enflesh(rawParameter);
    const range = new QueryRange(skip, limit);
    const hitResult = await dictionary.searchExamples(parameter, range);
    const [hitExamples, hitSize] = mapWithSize(hitResult, ExampleCreator.skeletonize);
    const body = {examples: hitExamples, total: hitSize};
    ExternalRestController.respond(response, 200, body);
  }

  @endpoint("/v0/dictionary/:identifier/example/:exampleNumber", "get")
  @before(checkMe(), limit(), validateQuery("fetchExample"), checkDictionary())
  public async [Symbol()](request: FilledRequest<"fetchExample", "dictionary">, response: Response<"fetchExample">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const exampleNumber = +request.params.exampleNumber;
    const example = await dictionary.fetchOneExampleByNumber(exampleNumber);
    if (example) {
      const body = {example: ExampleCreator.skeletonize(example)};
      ExternalRestController.respond(response, 200, body);
    } else {
      ExternalRestController.respond(response, 404, {error: "noSuchExample"});
    }
  }

  @endpoint("/v0/dictionary/:identifier/example", "post")
  @before(checkMe(), limit(), validateBody("addExample"), checkDictionary("edit"))
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
  @before(checkMe(), limit(), validateBody("editExample"), checkDictionary("edit"))
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
  @before(checkMe(), limit(), validateQuery("discardExample"), checkDictionary("edit"))
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

  @endpoint("/v0/exampleOffers", "get")
  @before(checkMe(), limit(), validateQuery("searchExampleOffers"))
  public async [Symbol()](request: Request<"searchExampleOffers">, response: Response<"searchExampleOffers">): Promise<void> {
    const {skip, limit, ...rawParameter} = request.query;
    const parameter = ExampleOfferParameterCreator.enflesh(rawParameter);
    const range = new QueryRange(skip, limit);
    const hitResult = await ExampleOfferModel.search(parameter, range);
    const [hitExampleOffers, hitSize] = mapWithSize(hitResult, ExampleOfferCreator.skeletonize);
    const body = {exampleOffers: hitExampleOffers, total: hitSize};
    ExternalRestController.respond(response, 200, body);
  }

  @endpoint("/v0/exampleOffer/:catalog/:exampleOfferNumber", "get")
  @before(checkMe(), limit(), validateQuery("fetchExampleOffer"))
  public async [Symbol()](request: FilledRequest<"fetchExampleOffer", "dictionary">, response: Response<"fetchExampleOffer">): Promise<void> {
    const catalog = request.params.catalog;
    const exampleOfferNumber = +request.params.exampleOfferNumber;
    const exampleOffer = await ExampleOfferModel.fetchOneByNumber(catalog, exampleOfferNumber);
    if (exampleOffer) {
      const body = {exampleOffer: ExampleOfferCreator.skeletonize(exampleOffer)};
      ExternalRestController.respond(response, 200, body);
    } else {
      ExternalRestController.respond(response, 404, {error: "noSuchExampleOffer"});
    }
  }

}