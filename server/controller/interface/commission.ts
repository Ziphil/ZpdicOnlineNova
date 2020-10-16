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
  verifyDictionary,
  verifyRecaptcha,
  verifyUser
} from "/server/controller/middle";
import {
  SERVER_PATH,
  SERVER_PATH_PREFIX
} from "/server/controller/type";
import {
  CommissionCreator,
  CommissionModel
} from "/server/model/commission";
import {
  DictionaryModel
} from "/server/model/dictionary";
import {
  CustomError
} from "/server/skeleton/error";
import {
  CastUtil
} from "/server/util/cast";
import {
  QueryRange
} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class CommissionController extends Controller {

  @post(SERVER_PATH["addCommission"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: PostRequest<"addCommission">, response: PostResponse<"addCommission">): Promise<void> {
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

  @post(SERVER_PATH["deleteCommission"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: PostRequest<"deleteCommission">, response: PostResponse<"deleteCommission">): Promise<void> {
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

  @get(SERVER_PATH["fetchCommissions"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: GetRequest<"fetchCommissions">, response: GetResponse<"fetchCommissions">): Promise<void> {
    let dictionary = request.dictionary;
    let offset = CastUtil.ensureNumber(request.query.offset);
    let size = CastUtil.ensureNumber(request.query.size);
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