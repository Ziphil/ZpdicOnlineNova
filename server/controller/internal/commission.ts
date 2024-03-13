//

import {CustomError} from "/client/skeleton";
import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyRecaptcha, verifyUser} from "/server/controller/internal/middle";
import {SERVER_PATHS, SERVER_PATH_PREFIX} from "/server/controller/internal/type";
import {CommissionCreator, CommissionModel} from "/server/model/commission";
import {DictionaryModel} from "../../model";
import {QueryRange} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class CommissionController extends Controller {

  @post(SERVER_PATHS["addCommission"])
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
        const body = CustomError.ofType("noSuchDictionaryNumber");
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("emptyCommissionName");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["discardCommission"])
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
        const body = CustomError.ofType("noSuchCommission");
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchCommissions"])
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
      const body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}