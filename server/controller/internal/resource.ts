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
import {
  QueryRange
} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class ResourceController extends Controller {

  @post(SERVER_PATHS["fetchResources"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchResources">, response: Response<"fetchResources">): Promise<void> {
    let dictionary = request.dictionary!;
    let offset = request.body.offset;
    let size = request.body.size;
    try {
      let path = `resource/${dictionary.number}`;
      let range = new QueryRange(offset, size);
      let names = QueryRange.restrictArrayWithSize(await AwsUtil.getFileNames(path), range);
      let body = names;
      Controller.respond(response, body);
    } catch (error) {
      console.log(error);
    }
  }

  @post(SERVER_PATHS["fetchUploadResourceUrl"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchUploadResourceUrl">, response: Response<"fetchUploadResourceUrl">): Promise<void> {
    let dictionary = request.dictionary!;
    let name = request.body.name;
    let type = request.body.type;
    try {
      let path = `resource/${dictionary.number}/${name}`;
      let url = await AwsUtil.getUploadFileUrl(path, type);
      let body = {url};
      Controller.respond(response, body);
    } catch (error) {
      console.log(error);
    }
  }

}