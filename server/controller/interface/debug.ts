//

import {
  Request,
  Response
} from "express";
import {
  Controller
} from "/server/controller/controller";
import {
  controller,
  get,
  post
} from "/server/controller/decorator";


@controller("/")
export class DebugController extends Controller {

  @get("/api/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    Controller.respond(response, null);
  }

  @post("/api/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    Controller.respond(response, null);
  }

}