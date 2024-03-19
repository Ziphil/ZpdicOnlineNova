//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyMe} from "/server/controller/internal/middle-old";
import {WordCreator} from "/server/creator";
import {DictionaryModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class WordController extends Controller {

  @post("/editWord")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"editWord">, response: Response<"editWord">): Promise<void> {
    const dictionary = request.dictionary;
    const {word} = request.body;
    if (dictionary) {
      try {
        const resultWord = await dictionary.editWord(word);
        const body = WordCreator.create(resultWord);
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondByCustomError(response, ["dictionarySaving"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/discardWord")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"discardWord">, response: Response<"discardWord">): Promise<void> {
    const dictionary = request.dictionary;
    const {wordNumber} = request.body;
    if (dictionary) {
      try {
        const resultWord = await dictionary.discardWord(wordNumber);
        const body = WordCreator.create(resultWord);
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondByCustomError(response, ["noSuchWord", "dictionarySaving"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/addRelations")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"addRelations">, response: Response<"addRelations">): Promise<void> {
    const dictionary = request.dictionary;
    const {specs} = request.body;
    if (dictionary) {
      try {
        const results = await Promise.allSettled(specs.map(async ({wordNumber, relation}) => {
          await dictionary.addRelation(wordNumber, relation);
        }));
        const rejectedResult = results.find((result) => result.status === "rejected") as PromiseRejectedResult | undefined;
        if (rejectedResult === undefined) {
          Controller.respond(response, null);
        } else {
          throw rejectedResult.reason;
        }
      } catch (error) {
        Controller.respondByCustomError(response, ["failAddRelations"], error);
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchWord")
  public async [Symbol()](request: Request<"fetchWord">, response: Response<"fetchWord">): Promise<void> {
    const {number, wordNumber} = request.body;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const word = await dictionary.fetchOneWordByNumber(wordNumber);
      if (word) {
        const body = await WordCreator.createDetailed(word);
        Controller.respond(response, body);
      } else {
        Controller.respondError(response, "noSuchWord");
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchWordNames")
  public async [Symbol()](request: Request<"fetchWordNames">, response: Response<"fetchWordNames">): Promise<void> {
    const {number, wordNumbers} = request.body;
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const names = await dictionary.fetchWordNames(wordNumbers);
      const body = {names};
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/checkDuplicateWordName")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"checkDuplicateWordName">, response: Response<"checkDuplicateWordName">): Promise<void> {
    const dictionary = request.dictionary;
    const {name, excludedWordNumber} = request.body;
    if (dictionary) {
      const duplicate = await dictionary.checkDuplicateWordName(name, excludedWordNumber);
      const body = {duplicate};
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }


}