//

import {Request, Response} from "express";
import {controller, get, post} from "/server/controller/decorator";
import {Controller} from "/server/controller/internal/controller";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class DebugController extends Controller {

  @get("/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    Controller.respond(response, null);
  }

  @post("/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    Controller.respond(response, null);
  }

}