//

import {
  NextFunction,
  Request,
  Response
} from "express";
import {
  BaseController
} from "./base";


export class UserController extends BaseController {

  private login(): void {
    console.log("Not implemented");
  }

  private debug(requset: Request, response: Response): void {
    response.send("Debugging");
  }

  public constructor() {
    super("/user");
  }

  protected setup(): void {
    let router = this.router;
    router.get("/login", this.login);
    router.get("/debug", this.debug);
  }

}