//

import {
  CustomError
} from "/client/skeleton/error";
import {
  Controller,
  Request,
  Response
} from "/server/controller/controller";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/middle";
import {
  HistoryCreator,
  HistoryModel
} from "/server/model/history";


@controller(SERVER_PATH_PREFIX)
export class HistoryController extends Controller {

  @post(SERVER_PATHS["fetchHistories"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchHistories">, response: Response<"fetchHistories">): Promise<void> {
    let dictionary = request.dictionary;
    let from = new Date(request.body.from);
    if (dictionary) {
      let histories = await HistoryModel.fetch(dictionary, from);
      let body = histories.map(HistoryCreator.create);
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  public static async addHistories(): Promise<void> {
    await HistoryModel.addAll();
  }

}