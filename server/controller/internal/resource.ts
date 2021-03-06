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
    if (dictionary) {
      try {
        let directoryPath = `resource/${dictionary.number}`;
        let path = `resource/${dictionary.number}/${name}`;
        let names = await AwsUtil.getFileNames(directoryPath);
        if (names.length < 25) {
          let configs = {contentType: "image/", sizeLimit: 1024 * 1024};
          let post = await AwsUtil.getUploadFilePost(path, configs);
          let body = post;
          Controller.respond(response, body);
        } else {
          let body = CustomError.ofType("resourceCountExceeded");
          Controller.respondError(response, body);
        }
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
        let names = await AwsUtil.getFileNames(path);
        let range = new QueryRange(offset, size);
        let result = QueryRange.restrictArrayWithSize(names, range);
        let body = result;
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