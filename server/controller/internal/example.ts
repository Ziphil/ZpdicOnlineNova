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
  ExampleCreator
} from "/server/model/dictionary";


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

  @post(SERVER_PATHS["removeExample"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"removeExample">, response: Response<"removeExample">): Promise<void> {
    let dictionary = request.dictionary;
    let exampleNumber = request.body.exampleNumber;
    if (dictionary) {
      try {
        let resultExample = await dictionary.removeExample(exampleNumber);
        let body = ExampleCreator.create(resultExample);
        Controller.respond(response, body);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError" && error.type === "noSuchExampleNumber") {
            return CustomError.ofType("noSuchExampleNumber");
          } else if (error.name === "CustomError" && error.type === "dictionarySaving") {
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

}