//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, FilledMiddlewareBody, Request, Response} from "/server/controller/internal/controller";
import {checkDictionary, checkMe} from "/server/controller/internal/middleware";
import {WordCreator} from "/server/creator";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class WordController extends Controller {

  @post("/editWord")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"editWord">, response: Response<"editWord">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {word} = request.body;
    try {
      const resultWord = await dictionary.editWord(word);
      const body = WordCreator.create(resultWord);
      Controller.respond(response, body);
    } catch (error) {
      Controller.respondByCustomError(response, ["dictionarySaving"], error);
    }
  }

  @post("/discardWord")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"discardWord">, response: Response<"discardWord">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {wordNumber} = request.body;
    try {
      const resultWord = await dictionary.discardWord(wordNumber);
      const body = WordCreator.create(resultWord);
      Controller.respond(response, body);
    } catch (error) {
      Controller.respondByCustomError(response, ["noSuchWord", "dictionarySaving"], error);
    }
  }

  @post("/addRelations")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"addRelations">, response: Response<"addRelations">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {specs} = request.body;
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
  }

  @post("/fetchWord")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchWord">, response: Response<"fetchWord">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {wordNumber} = request.body;
    const word = await dictionary.fetchOneWordByNumber(wordNumber);
    if (word) {
      const body = await WordCreator.createDetailed(word);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchWord");
    }
  }

  @post("/fetchWordNames")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchWordNames">, response: Response<"fetchWordNames">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody< "dictionary">;
    const {wordNumbers} = request.body;
    const names = await dictionary.fetchWordNames(wordNumbers);
    const body = {names};
    Controller.respond(response, body);
  }

  @post("/checkDuplicateWordName")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"checkDuplicateWordName">, response: Response<"checkDuplicateWordName">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {name, excludedWordNumber} = request.body;
    const duplicate = await dictionary.checkDuplicateWordName(name, excludedWordNumber);
    const body = {duplicate};
    Controller.respond(response, body);
  }

}