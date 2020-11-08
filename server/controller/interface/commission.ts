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
} from "/server/controller/interface/type";
import {
  verifyDictionary,
  verifyRecaptcha,
  verifyUser
} from "/server/controller/middle";
import {
  CommissionCreator,
  CommissionModel
} from "/server/model/commission";
import {
  DictionaryModel
} from "/server/model/dictionary";
import {
  CastUtil
} from "/server/util/cast";
import {
  QueryRange
} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class CommissionController extends Controller {

  @post(SERVER_PATHS["addCommission"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"addCommission">, response: Response<"addCommission">): Promise<void> {
    let number = CastUtil.ensureNumber(request.body.number);
    let name = CastUtil.ensureString(request.body.name);
    let comment = CastUtil.ensureString(request.body.comment);
    if (name !== "") {
      let dictionary = await DictionaryModel.findOneByNumber(number);
      if (dictionary) {
        let commission = await CommissionModel.add(dictionary, name, comment);
        let body = CommissionCreator.create(commission);
        Controller.respond(response, body);
      } else {
        let body = CustomError.ofType("noSuchDictionaryNumber");
        Controller.respondError(response, body);
      }
    } else {
      let body = CustomError.ofType("emptyCommissionName");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["deleteCommission"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"deleteCommission">, response: Response<"deleteCommission">): Promise<void> {
    let dictionary = request.dictionary!;
    let id = CastUtil.ensureString(request.body.id);
    if (dictionary) {
      let commission = await CommissionModel.findOneByDictionaryAndId(dictionary, id);
      if (commission) {
        await commission.delete();
        let body = CommissionCreator.create(commission);
        Controller.respond(response, body);
      } else {
        let body = CustomError.ofType("noSuchCommission");
        Controller.respondError(response, body);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchCommissions"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchCommissions">, response: Response<"fetchCommissions">): Promise<void> {
    let dictionary = request.dictionary;
    let offset = CastUtil.ensureNumber(request.body.offset);
    let size = CastUtil.ensureNumber(request.body.size);
    if (dictionary) {
      let range = new QueryRange(offset, size);
      let hitResult = await CommissionModel.findByDictionary(dictionary, range);
      let hitCommissions = hitResult[0].map(CommissionCreator.create);
      let hitSize = hitResult[1];
      let body = [hitCommissions, hitSize] as any;
      Controller.respond(response, body);
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}