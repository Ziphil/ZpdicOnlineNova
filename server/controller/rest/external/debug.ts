//

import {Request, Response} from "express";
import {RestController} from "/server/controller/rest/controller";
import {controller, get, post} from "/server/controller/rest/decorator";


@controller("/external")
export class DebugController extends RestController {

  @get("/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    response.json(null).end();
  }

  @post("/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    response.json(null).end();
  }

}