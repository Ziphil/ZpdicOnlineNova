//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyMe} from "/server/controller/internal/middle-old";
import {NotificationCreator} from "/server/creator";
import {NotificationModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {QueryRange} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class NotificationController extends Controller {

  @post("/addNotification")
  @before(verifyMe("admin"))
  public async [Symbol()](request: Request<"addNotification">, response: Response<"addNotification">): Promise<void> {
    const {type, title, text} = request.body;
    const notification = await NotificationModel.add(type, title, text);
    const body = NotificationCreator.create(notification);
    Controller.respond(response, body);
  }

  @post("/fetchNotifications")
  public async [Symbol()](request: Request<"fetchNotifications">, response: Response<"fetchNotifications">): Promise<void> {
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await NotificationModel.fetch(range);
    const hitNotifications = hitResult[0].map(NotificationCreator.create);
    const hitSize = hitResult[1];
    const body = [hitNotifications, hitSize] as any;
    Controller.respond(response, body);
  }

}