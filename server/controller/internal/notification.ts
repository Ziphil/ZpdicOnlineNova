//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyUser} from "/server/controller/internal/middle";
import {
  NotificationCreator,
  NotificationModel
} from "/server/model";
import {SERVER_PATHS, SERVER_PATH_PREFIX} from "/server/type/internal";
import {QueryRange} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class NotificationController extends Controller {

  @post(SERVER_PATHS["addNotification"])
  @before(verifyUser("admin"))
  public async [Symbol()](request: Request<"addNotification">, response: Response<"addNotification">): Promise<void> {
    const type = request.body.type;
    const title = request.body.title;
    const text = request.body.text;
    const notification = await NotificationModel.add(type, title, text);
    const body = NotificationCreator.create(notification);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchNotifications"])
  public async [Symbol()](request: Request<"fetchNotifications">, response: Response<"fetchNotifications">): Promise<void> {
    const offset = request.body.offset;
    const size = request.body.size;
    const range = new QueryRange(offset, size);
    const hitResult = await NotificationModel.fetch(range);
    const hitNotifications = hitResult[0].map(NotificationCreator.create);
    const hitSize = hitResult[1];
    const body = [hitNotifications, hitSize] as any;
    Controller.respond(response, body);
  }

}