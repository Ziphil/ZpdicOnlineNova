//

import {
  CustomError
} from "/client/skeleton";
import {
  controller,
  post
} from "/server/controller/decorator";
import {
  Controller,
  Request,
  Response
} from "/server/controller/internal/controller";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  DictionaryModel
} from "../../model";
import {
  HistoryCreator,
  HistoryModel
} from "/server/model/history";


@controller(SERVER_PATH_PREFIX)
export class HistoryController extends Controller {

  @post(SERVER_PATHS["fetchHistories"])
  public async [Symbol()](request: Request<"fetchHistories">, response: Response<"fetchHistories">): Promise<void> {
    const number = request.body.number;
    const from = new Date(request.body.from);
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const histories = await HistoryModel.fetch(dictionary, from);
      const body = histories.map(HistoryCreator.create);
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  public static async addHistories(): Promise<void> {
    await HistoryModel.addAll();
  }

}