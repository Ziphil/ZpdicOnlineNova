//

import {before, controller, post} from "/server/controller/rest/decorator";
import {Request, Response, RestController} from "/server/controller/rest/internal/controller";
import {checkMe} from "/server/controller/rest/internal/middleware";
import {NotificationCreator} from "/server/creator";
import {NotificationModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";


@controller(SERVER_PATH_PREFIX)
export class NotificationRestController extends RestController {

  @post("/addNotification")
  @before(checkMe("admin"))
  public async [Symbol()](request: Request<"addNotification">, response: Response<"addNotification">): Promise<void> {
    const {type, title, text} = request.body;
    const notification = await NotificationModel.add(type, title, text);
    const body = NotificationCreator.create(notification);
    RestController.respond(response, body);
  }

  @post("/fetchNotifications")
  public async [Symbol()](request: Request<"fetchNotifications">, response: Response<"fetchNotifications">): Promise<void> {
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await NotificationModel.fetch(range);
    const body = mapWithSize(hitResult, NotificationCreator.create);
    RestController.respond(response, body);
  }

}