//

import {
  CustomError
} from "/client/skeleton/error";
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
    let dictionary = request.dictionary;
    let example = request.body.example;
    if (dictionary) {
      try {
        let resultExample = await dictionary.editExample(example);
        let body = ExampleCreator.create(resultExample);
        Controller.respond(response, body);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError" && error.type === "dictionarySaving") {
            return CustomError.ofType("dictionarySaving");
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["discardExample"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"discardExample">, response: Response<"discardExample">): Promise<void> {
    let dictionary = request.dictionary;
    let exampleNumber = request.body.exampleNumber;
    if (dictionary) {
      try {
        let resultExample = await dictionary.discardExample(exampleNumber);
        let body = ExampleCreator.create(resultExample);
        Controller.respond(response, body);
      } catch (error) {
        let body = (() => {
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
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchExamples"])
  @before()
  public async [Symbol()](request: Request<"fetchExamples">, response: Response<"fetchExamples">): Promise<void> {
    let number = request.body.number;
    let offset = request.body.offset;
    let size = request.body.size;
    let dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      let range = new QueryRange(offset, size);
      let hitResult = await ExampleModel.fetchByDictionary(dictionary, range);
      let hitExamples = hitResult[0].map(ExampleCreator.create);
      let hitSize = hitResult[1];
      let body = [hitExamples, hitSize] as any;
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}