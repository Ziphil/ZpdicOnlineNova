//

import {
  CustomError
} from "/client/skeleton";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  Controller,
  Request,
  Response
} from "/server/controller/internal/controller";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  DictionaryModel,
  ExampleCreator,
  ExampleModel
} from "/server/model/dictionary";
import {
  QueryRange
} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class ExampleController extends Controller {

  @post(SERVER_PATHS["editExample"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"editExample">, response: Response<"editExample">): Promise<void> {
    const dictionary = request.dictionary;
    const example = request.body.example;
    if (dictionary) {
      try {
        const resultExample = await dictionary.editExample(example);
        const body = ExampleCreator.create(resultExample);
        Controller.respond(response, body);
      } catch (error) {
        const body = (() => {
          if (error.name === "CustomError" && error.type === "dictionarySaving") {
            return CustomError.ofType("dictionarySaving");
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["discardExample"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"discardExample">, response: Response<"discardExample">): Promise<void> {
    const dictionary = request.dictionary;
    const exampleNumber = request.body.exampleNumber;
    if (dictionary) {
      try {
        const resultExample = await dictionary.discardExample(exampleNumber);
        const body = ExampleCreator.create(resultExample);
        Controller.respond(response, body);
      } catch (error) {
        const body = (() => {
          if (error.name === "CustomError") {
            if (error.type === "noSuchExampleNumber") {
              return CustomError.ofType("noSuchExampleNumber");
            } else if (error.type === "dictionarySaving") {
              return CustomError.ofType("dictionarySaving");
            }
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchExample"])
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
        const body = CustomError.ofType("noSuchExampleNumber");
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchExamples"])
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
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}