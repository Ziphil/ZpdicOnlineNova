//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyMe, verifyRecaptcha} from "/server/controller/internal/middle-old";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {AwsUtil} from "/server/util/aws";
import {QueryRange} from "/server/util/query";


@controller(SERVER_PATH_PREFIX)
export class ResourceController extends Controller {

  @post("/fetchUploadResourcePost")
  @before(verifyRecaptcha(), verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"fetchUploadResourcePost">, response: Response<"fetchUploadResourcePost">): Promise<void> {
    const dictionary = request.dictionary!;
    const {name} = request.body;
    if (dictionary) {
      try {
        const directoryPath = `resource/${dictionary.number}`;
        const path = `resource/${dictionary.number}/${name}`;
        const names = await AwsUtil.getFileNames(directoryPath);
        if (names.length < 25) {
          const configs = {contentType: "image/", sizeLimit: 1024 * 1024};
          const post = await AwsUtil.getUploadFilePost(path, configs);
          const body = post;
          Controller.respond(response, body);
        } else {
          Controller.respondError(response, "resourceCountExceeded");
        }
      } catch (error) {
        Controller.respondError(response, "awsError");
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/discardResource")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"discardResource">, response: Response<"discardResource">): Promise<void> {
    const dictionary = request.dictionary!;
    const {name} = request.body;
    if (dictionary) {
      try {
        const path = `resource/${dictionary.number}/${name}`;
        await AwsUtil.deleteFile(path);
        Controller.respond(response, null);
      } catch (error) {
        Controller.respondError(response, "awsError");
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchResources")
  @before(verifyMe(), verifyDictionary("edit"))
  public async [Symbol()](request: Request<"fetchResources">, response: Response<"fetchResources">): Promise<void> {
    const dictionary = request.dictionary!;
    const {offset, size} = request.body;
    if (dictionary) {
      try {
        const path = `resource/${dictionary.number}`;
        const names = await AwsUtil.getFileNames(path);
        const range = new QueryRange(offset, size);
        const result = QueryRange.restrictArrayWithSize(names, range);
        const body = result;
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondError(response, "awsError");
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

  @post("/fetchUploadFontPost")
  @before(verifyRecaptcha(), verifyMe(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"fetchUploadFontPost">, response: Response<"fetchUploadFontPost">): Promise<void> {
    const dictionary = request.dictionary!;
    if (dictionary) {
      try {
        const path = `font/${dictionary.number}/font`;
        const configs = {contentType: "", sizeLimit: 1024 * 1024};
        const post = await AwsUtil.getUploadFilePost(path, configs);
        const body = post;
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondError(response, "awsError");
      }
    } else {
      Controller.respondError(response, "noSuchDictionary");
    }
  }

}