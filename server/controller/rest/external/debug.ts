//

import {Request, Response} from "express";
import {RestController} from "/server/controller/rest/controller";
import {post, restController} from "/server/controller/rest/decorator";


@restController("/external")
export class DebugController extends RestController {

  @post("/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    response.json(null).end();
  }

}