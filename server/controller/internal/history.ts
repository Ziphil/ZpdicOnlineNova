//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, FilledMiddlewareBody, Request, Response} from "/server/controller/internal/controller";
import {checkDictionary} from "/server/controller/internal/middleware";
import {HistoryCreator} from "/server/creator";
import {HistoryModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class HistoryController extends Controller {

  @post("/fetchHistories")
  @before(checkDictionary())
  public async [Symbol()](request: Request<"fetchHistories">, response: Response<"fetchHistories">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const from = new Date(request.body.from);
    const histories = await HistoryModel.fetch(dictionary, from);
    const body = histories.map(HistoryCreator.create);
    Controller.respond(response, body);
  }

}