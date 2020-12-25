//

import {
  S3
} from "aws-sdk";
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


@controller(SERVER_PATH_PREFIX)
export class ResourceController extends Controller {

  @post(SERVER_PATHS["fetchUploadResourceUrl"])
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchUploadResourceUrl">, response: Response<"fetchUploadResourceUrl">): Promise<void> {
    let dictionary = request.dictionary;
    let name = request.body.name;
    let type = request.body.type;
    let api = new S3();
    let params = Object.fromEntries([
      ["Bucket", process.env["AWS_BUCKET"]],
      ["Key", name],
      ["Expires", 60],
      ["ContentType", type],
      ["ACL", "public-read"]
    ]);
    api.getSignedUrl("putObject", params, (error, url) => {
      if (!error) {
        let body = {url};
        console.log(body);
        Controller.respond(response, body);
      } else {
        console.error(error);
      }
    });
  }

}