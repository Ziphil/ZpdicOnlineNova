//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/base";
import {checkDictionary, checkMe, parseMe} from "/server/internal/controller/rest/middleware";
import {RelationCreator, SuggestionCreator, WordCreator, WordParameterCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {DictionaryModel} from "/server/model";
import {QueryRange} from "/server/util/query";
import {mapWithSize, mapWithSizeAsync} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class WordRestController extends InternalRestController {

  @post("/editWord")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"editWord">, response: Response<"editWord">): Promise<void> {
    const {me, dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const word = WordCreator.enflesh(request.body.word);
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
      const results = await Promise.allSettled(specs.map(async (spec) => {
        const wordNumber = spec.wordNumber;
        const relation = RelationCreator.enflesh(spec.relation);
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
  @before(parseMe(), checkDictionary("view"))
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

  @post("/fetchWordSpellings")
  @before(parseMe(), checkDictionary("view"))
  public async [Symbol()](request: Request<"fetchWordSpellings">, response: Response<"fetchWordSpellings">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {wordNumbers} = request.body;
    const spellings = await dictionary.fetchWordSpellings(wordNumbers);
    const body = {spellings};
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

  @post("/checkDuplicateWordSpelling")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"checkDuplicateWordSpelling">, response: Response<"checkDuplicateWordSpelling">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {name, excludedWordNumber} = request.body;
    const duplicate = await dictionary.checkDuplicateWordSpelling(name, excludedWordNumber);
    const body = {duplicate};
    InternalRestController.respond(response, body);
  }

  @post("/searchWords")
  @before(parseMe(), checkDictionary("view"))
  public async [Symbol()](request: Request<"searchWords">, response: Response<"searchWords">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {offset, size} = request.body;
    const parameter = WordParameterCreator.enflesh(request.body.parameter);
    const range = new QueryRange(offset, size);
    const hitResult = await dictionary.searchWords(parameter, range);
    const body = {
      words: await mapWithSizeAsync(hitResult.words, WordCreator.skeletonizeWithExamples),
      suggestions: hitResult.suggestions.map(SuggestionCreator.skeletonize)
    };
    InternalRestController.respond(response, body);
  }

  @post("/searchRelationWords")
  @before(parseMe(), checkDictionary("view"))
  public async [Symbol()](request: Request<"searchRelationWords">, response: Response<"searchRelationWords">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {pattern} = request.body;
    const hitWords = await dictionary.searchRelationWords(pattern);
    const body = hitWords.map(WordCreator.skeletonize);
    InternalRestController.respond(response, body);
  }

  @post("/searchWordsGlobally")
  public async [Symbol()](request: Request<"searchWordsGlobally">, response: Response<"searchWordsGlobally">): Promise<void> {
    const {offset, size} = request.body;
    const parameter = WordParameterCreator.enflesh(request.body.parameter);
    const range = new QueryRange(offset, size);
    const hitResult = await DictionaryModel.searchWordsGlobally(parameter, range);
    const body = await mapWithSizeAsync(hitResult, ({dictionary, word}) => WordCreator.skeletonizeWithExamplesAndDictionary(word, dictionary));
    InternalRestController.respond(response, body);
  }

}