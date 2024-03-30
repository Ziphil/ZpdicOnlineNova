//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/controller/rest/internal/controller";
import {checkDictionary, checkMe, parseDictionary} from "/server/controller/rest/internal/middleware";
import {ExampleCreator, ExampleOfferCreator} from "/server/creator";
import {ExampleModel, ExampleOfferModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class ExampleRestController extends InternalRestController {

  @post("/editExample")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"editExample">, response: Response<"editExample">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {example} = request.body;
    try {
      const resultExample = await dictionary.editExample(example);
      const body = ExampleCreator.create(resultExample);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["dictionarySaving"], error);
    }
  }

  @post("/discardExample")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"discardExample">, response: Response<"discardExample">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {exampleNumber} = request.body;
    try {
      const resultExample = await dictionary.discardExample(exampleNumber);
      const body = ExampleCreator.create(resultExample);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["noSuchExample", "dictionarySaving"], error);
    }
  }

  @post("/fetchExample")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchExample">, response: Response<"fetchExample">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {exampleNumber} = request.body;
    const example = await dictionary.fetchOneExampleByNumber(exampleNumber);
    if (example) {
      const body = ExampleCreator.create(example);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchExample");
    }
  }

  @post("/fetchExamples")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchExamples">, response: Response<"fetchExamples">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await ExampleModel.fetchByDictionary(dictionary, range);
    const body = mapWithSize(hitResult, ExampleCreator.create);
    InternalRestController.respond(response, body);
  }

  @post("/fetchExamplesByOffer")
  @before(parseDictionary())
  public async [Symbol()](request: Request<"fetchExamplesByOffer">, response: Response<"fetchExamplesByOffer">): Promise<void> {
    const {dictionary} = request.middlewareBody;
    const {offerId, offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await ExampleModel.fetchByOffer(dictionary, offerId, range);
    const body = mapWithSize(hitResult, ExampleCreator.create);
    InternalRestController.respond(response, body);
  }

  @post("/fetchExampleOffers")
  public async [Symbol()](request: Request<"fetchExampleOffers">, response: Response<"fetchExampleOffers">): Promise<void> {
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await ExampleOfferModel.fetch(range);
    const body = mapWithSize(hitResult, ExampleOfferCreator.create);
    InternalRestController.respond(response, body);
  }

}