//

import {Request, Response} from "express";
import {RestController} from "../controller";
import {get, post, restController} from "/server/controller/rest/decorator";


@restController("/external")
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