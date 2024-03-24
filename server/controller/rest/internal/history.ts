//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/controller/rest/internal/controller";
import {checkDictionary} from "/server/controller/rest/internal/middleware";
import {HistoryCreator} from "/server/creator";
import {HistoryModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";


@restController(SERVER_PATH_PREFIX)
export class HistoryRestController extends InternalRestController {

  @post("/fetchHistories")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchHistories">, response: Response<"fetchHistories">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const from = new Date(request.body.from);
    const histories = await HistoryModel.fetch(dictionary, from);
    const body = histories.map(HistoryCreator.create);
    InternalRestController.respond(response, body);
  }

}