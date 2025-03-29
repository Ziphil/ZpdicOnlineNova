//

import {Request, Response} from "express";
import {RestController} from "/server/controller/rest/controller";
import {post, restController} from "/server/controller/rest/decorator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";


@restController(SERVER_PATH_PREFIX)
export class DebugRestController extends RestController {

  @post("/debug/addDailyExampleOffer")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
  }

}