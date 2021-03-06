//

import {
  CustomError
} from "/client/skeleton/error";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  Controller,
  Request,
  Response
} from "/server/controller/internal/controller";
import {
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  NotificationCreator,
  NotificationModel
} from "/server/model/notification";
import {
  QueryRange
} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class NotificationController extends Controller {

  @post(SERVER_PATHS["addNotification"])
  @before(verifyUser("admin"))
  public async [Symbol()](request: Request<"addNotification">, response: Response<"addNotification">): Promise<void> {
    let type = request.body.type;
    let title = request.body.title;
    let text = request.body.text;
    let notification = await NotificationModel.add(type, title, text);
    let body = NotificationCreator.create(notification);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchNotifications"])
  public async [Symbol()](request: Request<"fetchNotifications">, response: Response<"fetchNotifications">): Promise<void> {
    let offset = request.body.offset;
    let size = request.body.size;
    let range = new QueryRange(offset, size);
    let hitResult = await NotificationModel.fetch(range);
    let hitNotifications = hitResult[0].map(NotificationCreator.create);
    let hitSize = hitResult[1];
    let body = [hitNotifications, hitSize] as any;
    Controller.respond(response, body);
  }

}