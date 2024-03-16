//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyMe} from "/server/controller/internal/middle";
import {ExampleCreator} from "/server/creator";
import {DictionaryModel, ExampleModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {QueryRange} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class ExampleController extends Controller {

  @post("/editExample")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"editExample">, response: Response<"editExample">): Promise<void> {
    const dictionary = request.dictionary;
    const example = request.body.example;
    if (dictionary) {
      try {
        const resultExample = await dictionary.editExample(example);
        const body = ExampleCreator.create(resultExample);
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondByCustomError(response, ["dictionarySaving"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/discardExample")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"discardExample">, response: Response<"discardExample">): Promise<void> {
    const dictionary = request.dictionary;
    const exampleNumber = request.body.exampleNumber;
    if (dictionary) {
      try {
        const resultExample = await dictionary.discardExample(exampleNumber);
        const body = ExampleCreator.create(resultExample);
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondByCustomError(response, ["noSuchExample", "dictionarySaving"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchExample")
  @before()
  public async [Symbol()](request: Request<"fetchExample">, response: Response<"fetchExample">): Promise<void> {
    const number = request.body.number;
    const exampleNumber = request.body.exampleNumber;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const example = await dictionary.fetchOneExampleByNumber(exampleNumber);
      if (example) {
        const body = ExampleCreator.create(example);
        Controller.respond(response, body);
      } else {
        Controller.respondError(response, "noSuchExample");
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchExamples")
  @before()
  public async [Symbol()](request: Request<"fetchExamples">, response: Response<"fetchExamples">): Promise<void> {
    const number = request.body.number;
    const offset = request.body.offset;
    const size = request.body.size;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const range = new QueryRange(offset, size);
      const hitResult = await ExampleModel.fetchByDictionary(dictionary, range);
      const hitExamples = hitResult[0].map(ExampleCreator.create);
      const hitSize = hitResult[1];
      const body = [hitExamples, hitSize] as any;
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

}