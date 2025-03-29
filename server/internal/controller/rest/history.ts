//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/base";
import {checkDictionary} from "/server/internal/controller/rest/middleware";
import {HistoryCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {HistoryModel} from "/server/model";


@restController(SERVER_PATH_PREFIX)
export class HistoryRestController extends InternalRestController {

  @post("/fetchHistories")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchHistories">, response: Response<"fetchHistories">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const from = new Date(request.body.from);
    const histories = await HistoryModel.fetch(dictionary, from);
    const body = histories.map(HistoryCreator.skeletonize);
    InternalRestController.respond(response, body);
  }

}