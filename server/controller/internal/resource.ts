//

import {
  CustomError
} from "/client/skeleton/error";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  Controller,
  Request,
  Response
} from "/server/controller/internal/controller";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  AwsUtil
} from "/server/util/aws";


@controller(SERVER_PATH_PREFIX)
export class ResourceController extends Controller {

  @post(SERVER_PATHS["fetchUploadResourceUrl"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchUploadResourceUrl">, response: Response<"fetchUploadResourceUrl">): Promise<void> {
    let dictionary = request.dictionary;
    let name = request.body.name;
    let type = request.body.type;
    try {
      let url = await AwsUtil.getUploadResourceUrl(name, type);
      let body = {url};
      Controller.respond(response, body);
    } catch (error) {
      console.log(error);
    }
  }

}