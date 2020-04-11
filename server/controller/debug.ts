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
  public async getDebug(request: Request, response: Response): Promise<void> {
    response.json(null);
  }

  @post("/api/debug")
  public async postDebug(request: Request, response: Response): Promise<void> {
    response.json(null);
  }

}