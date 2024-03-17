//

import {Request, Response} from "express";
import {Controller} from "/server/controller/controller";
import {controller, get, post} from "/server/controller/decorator";


@controller("/external")
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