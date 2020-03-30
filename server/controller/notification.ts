//

import {
  Controller,
  GetRequest,
  GetResponse,
  PostRequest,
  PostResponse
} from "/server/controller/controller";
import {
  controller,
  get,
  post
} from "/server/controller/decorator";
import {
  SERVER_PATH
} from "/server/controller/type";
import {
  NotificationModel
} from "/server/model/notification";
import {
  CustomErrorSkeleton
} from "/server/skeleton/error";
import {
  NotificationSkeleton
} from "/server/skeleton/notification";
import {
  CastUtil
} from "/server/util/cast";


@controller("/")
export class NotificationController extends Controller {

  @get(SERVER_PATH["fetchNotifications"])
  public async getFetchNotifications(request: GetRequest<"fetchNotifications">, response: GetResponse<"fetchNotifications">): Promise<void> {
    let offset = CastUtil.ensureNumber(request.query.offset);
    let size = CastUtil.ensureNumber(request.query.size);
    let notifications = await NotificationModel.findAll(offset, size);
    let body = notifications.map(NotificationSkeleton.from);
    response.json(body);
  }

}