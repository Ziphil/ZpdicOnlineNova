//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/controller/rest/internal/controller";
import {checkDictionary, checkMe} from "/server/controller/rest/internal/middleware";
import {ArticleCreator} from "/server/creator";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class ArticleRestController extends InternalRestController {

  @post("/editArticle")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"editArticle">, response: Response<"editArticle">): Promise<void> {
    const {me, dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {article} = request.body;
    try {
      const resultArticle = await dictionary.editArticle(article, me);
      const body = ArticleCreator.skeletonize(resultArticle);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["dictionarySaving"], error);
    }
  }

  @post("/discardArticle")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"discardArticle">, response: Response<"discardArticle">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {articleNumber} = request.body;
    try {
      const resultArticle = await dictionary.discardArticle(articleNumber);
      const body = ArticleCreator.skeletonize(resultArticle);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["noSuchArticle", "dictionarySaving"], error);
    }
  }

  @post("/fetchArticle")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchArticle">, response: Response<"fetchArticle">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {articleNumber} = request.body;
    const article = await dictionary.fetchOneArticleByNumber(articleNumber);
    if (article) {
      const body = ArticleCreator.skeletonize(article);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchArticle");
    }
  }

  @post("/searchArticles")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"searchArticles">, response: Response<"searchArticles">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await dictionary.searchArticles(range);
    const body = mapWithSize(hitResult, ArticleCreator.skeletonize);
    InternalRestController.respond(response, body);
  }

}