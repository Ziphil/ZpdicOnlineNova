//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/base";
import {checkDictionary, checkMe} from "/server/internal/controller/rest/middleware";
import {WordCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class WordRestController extends InternalRestController {

  @post("/editWord")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"editWord">, response: Response<"editWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {word} = request.body;
    try {
      const resultWord = await dictionary.editWord(word, me);
      const body = WordCreator.skeletonize(resultWord);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["dictionarySaving"], error);
    }
  }

  @post("/discardWord")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"discardWord">, response: Response<"discardWord">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {wordNumber} = request.body;
    try {
      const resultWord = await dictionary.discardWord(wordNumber);
      const body = WordCreator.skeletonize(resultWord);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["noSuchWord", "dictionarySaving"], error);
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
      const rejectedResult = results.find((result) => result.status === "rejected") as any as PromiseRejectedResult | undefined;
      if (rejectedResult === undefined) {
        InternalRestController.respond(response, null);
      } else {
        throw rejectedResult.reason;
      }
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["failAddRelations"], error);
    }
  }

  @post("/fetchWord")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchWord">, response: Response<"fetchWord">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {wordNumber} = request.body;
    const word = await dictionary.fetchOneWordByNumber(wordNumber);
    if (word) {
      const body = await WordCreator.skeletonizeWithExamples(word);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchWord");
    }
  }

  @post("/fetchWordNames")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchWordNames">, response: Response<"fetchWordNames">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {wordNumbers} = request.body;
    const names = await dictionary.fetchWordNames(wordNumbers);
    const body = {names};
    InternalRestController.respond(response, body);
  }

  @post("/fetchOldWords")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"fetchOldWords">, response: Response<"fetchOldWords">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {wordNumber, offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const words = await dictionary.fetchOldWords(wordNumber, range);
    const body = mapWithSize(words, WordCreator.skeletonize);
    InternalRestController.respond(response, body);
  }

  @post("/checkDuplicateWordName")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"checkDuplicateWordName">, response: Response<"checkDuplicateWordName">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {name, excludedWordNumber} = request.body;
    const duplicate = await dictionary.checkDuplicateWordName(name, excludedWordNumber);
    const body = {duplicate};
    InternalRestController.respond(response, body);
  }

}