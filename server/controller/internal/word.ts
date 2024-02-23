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
  WordCreator
} from "/server/model/dictionary";


@controller(SERVER_PATH_PREFIX)
export class WordController extends Controller {

  @post(SERVER_PATHS["editWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"editWord">, response: Response<"editWord">): Promise<void> {
    const dictionary = request.dictionary;
    const word = request.body.word;
    if (dictionary) {
      try {
        const resultWord = await dictionary.editWord(word);
        const body = WordCreator.create(resultWord);
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

  @post(SERVER_PATHS["discardWord"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"discardWord">, response: Response<"discardWord">): Promise<void> {
    const dictionary = request.dictionary;
    const wordNumber = request.body.wordNumber;
    if (dictionary) {
      try {
        const resultWord = await dictionary.discardWord(wordNumber);
        const body = WordCreator.create(resultWord);
        Controller.respond(response, body);
      } catch (error) {
        const body = (() => {
          if (error.name === "CustomError") {
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
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["addRelations"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"addRelations">, response: Response<"addRelations">): Promise<void> {
    const dictionary = request.dictionary;
    const specs = request.body.specs;
    if (dictionary) {
      try {
        const promises = specs.map(async ({wordNumber, relation}) => {
          await dictionary.addRelation(wordNumber, relation);
        });
        const results = await Promise.allSettled(promises);
        const rejectedResult = results.find((result) => result.status === "rejected") as PromiseRejectedResult | undefined;
        if (rejectedResult !== undefined) {
          throw rejectedResult.reason;
        }
        Controller.respond(response, null);
      } catch (error) {
        const body = (() => {
          if (error.name === "CustomError") {
            return CustomError.ofType("failAddRelations");
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchWord"])
  public async [Symbol()](request: Request<"fetchWord">, response: Response<"fetchWord">): Promise<void> {
    const number = request.body.number;
    const wordNumber = request.body.wordNumber;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const word = await dictionary.fetchOneWordByNumber(wordNumber);
      if (word) {
        const body = await WordCreator.createDetailed(word);
        Controller.respond(response, body);
      } else {
        const body = CustomError.ofType("noSuchWordNumber");
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchWordNames"])
  public async [Symbol()](request: Request<"fetchWordNames">, response: Response<"fetchWordNames">): Promise<void> {
    const number = request.body.number;
    const wordNumbers = request.body.wordNumbers;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const names = await dictionary.fetchWordNames(wordNumbers);
      const body = {names};
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["checkDuplicateWordName"])
  @before(verifyUser(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"checkDuplicateWordName">, response: Response<"checkDuplicateWordName">): Promise<void> {
    const dictionary = request.dictionary;
    const name = request.body.name;
    const excludedWordName = request.body.excludedWordNumber;
    if (dictionary) {
      const duplicate = await dictionary.checkDuplicateWordName(name, excludedWordName);
      const body = {duplicate};
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }


}