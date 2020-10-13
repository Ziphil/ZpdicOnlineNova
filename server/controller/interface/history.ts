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
  SERVER_PATH,
  SERVER_PATH_PREFIX
} from "/server/controller/type";
import {
  HistoryModel
} from "/server/model/history";
import {
  CustomError
} from "/server/skeleton/error";


@controller(SERVER_PATH_PREFIX)
export class HistoryController {

  public static async addHistories(): Promise<void> {
    await HistoryModel.addAll();
  }

}