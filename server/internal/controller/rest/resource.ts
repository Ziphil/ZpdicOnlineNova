//

import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/controller";
import {before, post, restController} from "/server/internal/controller/rest/decorator";
import {checkDictionary, checkMe, checkRecaptcha} from "/server/internal/controller/rest/middleware";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {AwsUtil} from "/server/util/aws";
import {QueryRange} from "/server/util/query";


@restController(SERVER_PATH_PREFIX)
export class ResourceRestController extends InternalRestController {

  @post("/fetchUploadResourcePost")
  @before(checkRecaptcha(), checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"fetchUploadResourcePost">, response: Response<"fetchUploadResourcePost">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {name} = request.body;
    try {
      const directoryPath = `resource/${dictionary.number}`;
      const path = `resource/${dictionary.number}/${name}`;
      const names = await AwsUtil.getFileNames(directoryPath);
      if (names.length < 25) {
        const configs = {contentType: "image/", sizeLimit: 1024 * 1024};
        const post = await AwsUtil.getUploadFilePost(path, configs);
        const body = post;
        InternalRestController.respond(response, body);
      } else {
        InternalRestController.respondError(response, "resourceCountExceeded");
      }
    } catch (error) {
      InternalRestController.respondError(response, "awsError");
    }
  }

  @post("/discardResource")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"discardResource">, response: Response<"discardResource">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {name} = request.body;
    try {
      const path = `resource/${dictionary.number}/${name}`;
      await AwsUtil.deleteFile(path);
      InternalRestController.respond(response, null);
    } catch (error) {
      InternalRestController.respondError(response, "awsError");
    }
  }

  @post("/fetchResources")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"fetchResources">, response: Response<"fetchResources">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {offset, size} = request.body;
    try {
      const path = `resource/${dictionary.number}`;
      const names = await AwsUtil.getFileNames(path);
      const range = new QueryRange(offset, size);
      const result = QueryRange.restrictArrayWithSize(names, range);
      const body = result;
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondError(response, "awsError");
    }
  }

  @post("/fetchUploadDictionaryFontPost")
  @before(checkRecaptcha(), checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"fetchUploadDictionaryFontPost">, response: Response<"fetchUploadDictionaryFontPost">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    try {
      const path = `font/${dictionary.number}/font`;
      const configs = {contentType: "", sizeLimit: 1024 * 1024};
      const post = await AwsUtil.getUploadFilePost(path, configs);
      const body = post;
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondError(response, "awsError");
    }
  }

}