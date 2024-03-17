//

import {controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {HistoryCreator} from "/server/creator";
import {DictionaryModel, HistoryModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class HistoryController extends Controller {

  @post("/fetchHistories")
  public async [Symbol()](request: Request<"fetchHistories">, response: Response<"fetchHistories">): Promise<void> {
    const {number} = request.body;
    const from = new Date(request.body.from);
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary) {
      const histories = await HistoryModel.fetch(dictionary, from);
      const body = histories.map(HistoryCreator.create);
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  public static async addHistories(): Promise<void> {
    await HistoryModel.addAll();
  }

}