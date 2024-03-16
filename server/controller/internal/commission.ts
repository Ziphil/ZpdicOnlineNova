//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyRecaptcha, verifyUser} from "/server/controller/internal/middle";
import {CommissionCreator} from "/server/creator";
import {CommissionModel, DictionaryModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {QueryRange} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class CommissionController extends Controller {

  @post("/addCommission")
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"addCommission">, response: Response<"addCommission">): Promise<void> {
    const number = request.body.number;
    const name = request.body.name;
    const comment = request.body.comment;
    if (name !== "") {
      const dictionary = await DictionaryModel.fetchOneByNumber(number);
      if (dictionary) {
        const commission = await CommissionModel.add(dictionary, name, comment);
        const body = CommissionCreator.create(commission);
        Controller.respond(response, body);
      } else {
        Controller.respondError(response, "noSuchDictionaryNumber");
      }
    } else {
      Controller.respondError(response, "emptyCommissionName");
    }
  }

  @post("/discardCommission")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"discardCommission">, response: Response<"discardCommission">): Promise<void> {
    const dictionary = request.dictionary!;
    const id = request.body.id;
    if (dictionary) {
      const commission = await CommissionModel.fetchOneByDictionaryAndId(dictionary, id);
      if (commission) {
        await commission.discard();
        const body = CommissionCreator.create(commission);
        Controller.respond(response, body);
      } else {
        Controller.respondError(response, "noSuchCommission");
      }
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

  @post("/fetchCommissions")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchCommissions">, response: Response<"fetchCommissions">): Promise<void> {
    const dictionary = request.dictionary;
    const offset = request.body.offset;
    const size = request.body.size;
    if (dictionary) {
      const range = new QueryRange(offset, size);
      const hitResult = await CommissionModel.fetchByDictionary(dictionary, range);
      const hitCommissions = hitResult[0].map(CommissionCreator.create);
      const hitSize = hitResult[1];
      const body = [hitCommissions, hitSize] as any;
      Controller.respond(response, body);
    } else {
      Controller.respondError(response, "noSuchDictionaryNumber");
    }
  }

}