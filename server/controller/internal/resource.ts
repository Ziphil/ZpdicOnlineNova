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
  verifyRecaptcha,
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

  @post(SERVER_PATHS["fetchUploadResourcePost"])
  @before(verifyRecaptcha(), verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchUploadResourcePost">, response: Response<"fetchUploadResourcePost">): Promise<void> {
    let dictionary = request.dictionary!;
    let name = request.body.name;
    let type = request.body.type;
    if (dictionary) {
      try {
        let path = `resource/${dictionary.number}/${name}`;
        let post = await AwsUtil.getUploadFilePost(path);
        let body = post;
        Controller.respond(response, body);
      } catch (error) {
        let body = CustomError.ofType("awsError");
        Controller.respondError(response, body);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["discardResource"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"discardResource">, response: Response<"discardResource">): Promise<void> {
    let dictionary = request.dictionary!;
    let name = request.body.name;
    if (dictionary) {
      try {
        let path = `resource/${dictionary.number}/${name}`;
        await AwsUtil.deleteFile(path);
        Controller.respond(response, null);
      } catch (error) {
        let body = CustomError.ofType("awsError");
        Controller.respondError(response, body);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchResources"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchResources">, response: Response<"fetchResources">): Promise<void> {
    let dictionary = request.dictionary!;
    let offset = request.body.offset;
    let size = request.body.size;
    if (dictionary) {
      try {
        let path = `resource/${dictionary.number}`;
        let range = new QueryRange(offset, size);
        let names = QueryRange.restrictArrayWithSize(await AwsUtil.getFileNames(path), range);
        let body = names;
        Controller.respond(response, body);
      } catch (error) {
        let body = CustomError.ofType("awsError");
        Controller.respondError(response, body);
      }
    } else {
      let body = CustomError.ofType("noSuchDictionaryNumber");
      Controller.respondError(response, body);
    }
  }

}