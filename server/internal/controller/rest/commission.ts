//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/base";
import {checkDictionary, checkMe, checkRecaptcha, parseDictionary} from "/server/internal/controller/rest/middleware";
import {CommissionCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {CommissionModel} from "/server/model";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class CommissionRestController extends InternalRestController {

  @post("/addCommission")
  @before(checkRecaptcha(), parseDictionary())
  public async [Symbol()](request: Request<"addCommission">, response: Response<"addCommission">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {name, comment} = request.body;
    if (name !== "") {
      const commission = await CommissionModel.add(dictionary, name, comment);
      const body = CommissionCreator.skeletonize(commission);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "emptyCommissionName");
    }
  }

  @post("/discardCommission")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"discardCommission">, response: Response<"discardCommission">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {id} = request.body;
    const commission = await CommissionModel.fetchOneByDictionaryAndId(dictionary, id);
    if (commission) {
      await commission.discard();
      const body = CommissionCreator.skeletonize(commission);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchCommission");
    }
  }

  @post("/fetchCommissions")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"fetchCommissions">, response: Response<"fetchCommissions">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await CommissionModel.fetchByDictionary(dictionary, range);
    const body = mapWithSize(hitResult, CommissionCreator.skeletonize);
    return InternalRestController.respond(response, body);
  }

}