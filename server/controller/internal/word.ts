//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyUser} from "/server/controller/internal/middle";
import {WordCreator} from "/server/creator";
import {DictionaryModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class WordController extends Controller {

  @post("/editWord")
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
        Controller.respondByCustomError(response, ["dictionarySaving"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/discardWord")
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
        Controller.respondByCustomError(response, ["noSuchWordNumber", "dictionarySaving"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/addRelations")
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
        Controller.respondByCustomError(response, ["failAddRelations"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchWord")
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
        Controller.respondError(response, "noSuchWordNumber");
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchWordNames")
  public async [Symbol()](request: Request<"fetchWordNames">, response: Response<"fetchWordNames">): Promise<void> {
    const number = request.body.number;
    const wordNumbers = request.body.wordNumbers;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const names = await dictionary.fetchWordNames(wordNumbers);
      const body = {names};
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/checkDuplicateWordName")
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
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }


}