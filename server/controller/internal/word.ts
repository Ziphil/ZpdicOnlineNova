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
  WordCreator
} from "/server/model/dictionary";


@controller(SERVER_PATH_PREFIX)
export class WordController extends Controller {

  @post(SERVER_PATHS["editWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"editWord">, response: Response<"editWord">): Promise<void> {
    let dictionary = request.dictionary;
    let word = request.body.word;
    if (dictionary) {
      try {
        let resultWord = await dictionary.editWord(word);
        let body = WordCreator.create(resultWord);
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

  @post(SERVER_PATHS["discardWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"discardWord">, response: Response<"discardWord">): Promise<void> {
    let dictionary = request.dictionary;
    let wordNumber = request.body.wordNumber;
    if (dictionary) {
      try {
        let resultWord = await dictionary.discardWord(wordNumber);
        let body = WordCreator.create(resultWord);
        Controller.respond(response, body);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError"){
            if (error.type === "noSuchWordNumber") {
              return CustomError.ofType("noSuchWordNumber");
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

  @post(SERVER_PATHS["addRelations"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"addRelations">, response: Response<"addRelations">): Promise<void> {
    let dictionary = request.dictionary;
    let specs = request.body.specs;
    if (dictionary) {
      try {
        let promises = specs.map(async ({wordNumber, relation}) => {
          await dictionary!.addRelation(wordNumber, relation);
        });
        let results = await Promise.allSettled(promises);
        let rejectedResult = results.find((result) => result.status === "rejected") as PromiseRejectedResult | undefined;
        if (rejectedResult !== undefined) {
          throw rejectedResult.reason;
        }
        Controller.respond(response, null);
      } catch (error) {
        let body = (() => {
          if (error.name === "CustomError"){
            return CustomError.ofType("failAddRelations");
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchWordNames"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"fetchWordNames">, response: Response<"fetchWordNames">): Promise<void> {
    let dictionary = request.dictionary;
    let wordNumbers = request.body.wordNumbers;
    if (dictionary) {
      let names = await dictionary.fetchWordNames(wordNumbers);
      let body = {names};
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}