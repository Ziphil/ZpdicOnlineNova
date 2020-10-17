//

import {
  Controller,
  GetRequest,
  GetResponse,
  PostRequest,
  PostResponse
} from "/server/controller/controller";
import {
  before,
  controller,
  get,
  post
} from "/server/controller/decorator";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/interface/type";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/middle";
import {
  HistoryCreator,
  HistoryModel
} from "/server/model/history";
import {
  CustomError
} from "/server/skeleton/error";
import {
  CastUtil
} from "/server/util/cast";


@controller(SERVER_PATH_PREFIX)
export class HistoryController extends Controller {

  @get(SERVER_PATHS["fetchHistories"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: GetRequest<"fetchHistories">, response: GetResponse<"fetchHistories">): Promise<void> {
    let dictionary = request.dictionary;
    let from = new Date(CastUtil.ensureString(request.query.from));
    if (dictionary) {
      let histories = await HistoryModel.findLatest(dictionary, from);
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