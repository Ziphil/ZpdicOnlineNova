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

  private debug(requset: Request, response: Response, next: NextFunction): void {
    response.send("Debugging");
  }

  protected setup(): void {
    let router = this.router;
    router.get("/login", (request, response, next) => {
      this.login();
    });
    router.get("/debug", (request, response, next) => {
      this.debug(request, response, next);
    });
  }

}