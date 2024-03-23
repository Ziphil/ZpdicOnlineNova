//

import {before, controller, post} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, Request, Response, RestController} from "/server/controller/rest/internal/controller";
import {checkDictionary, checkMe, checkRecaptcha} from "/server/controller/rest/internal/middleware";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";
import {AwsUtil} from "/server/util/aws";
import {QueryRange} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class ResourceRestController extends RestController {

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
        RestController.respond(response, body);
      } else {
        RestController.respondError(response, "resourceCountExceeded");
      }
    } catch (error) {
      RestController.respondError(response, "awsError");
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
      RestController.respond(response, null);
    } catch (error) {
      RestController.respondError(response, "awsError");
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
      RestController.respond(response, body);
    } catch (error) {
      RestController.respondError(response, "awsError");
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
      RestController.respond(response, body);
    } catch (error) {
      RestController.respondError(response, "awsError");
    }
  }

}