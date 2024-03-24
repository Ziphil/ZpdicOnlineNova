//

import {Request, Response} from "express";
import {Controller} from "/server/controller/controller";
import {get, post, restController} from "/server/controller/rest/decorator";


@restController("/external")
export class DebugController extends Controller {

  @get("/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    response.json(null).end();
  }

  @post("/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    response.json(null).end();
  }

}