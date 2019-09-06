//

import {
  NextFunction,
  Request,
  Response
} from "express";
import {
  User
} from "../model/user";
import {
  BaseController
} from "./base";


export class UserController extends BaseController {

  private login(): void {
    console.log("Not implemented");
  }

  private debug(requset: Request, response: Response): void {
    let user = new User({name: "Test", password: "password", email: "foo@bar.com"});
    user.save((error) => {
      if (error) {
        response.send("Error");
      } else {
        response.send("Success");
      }
    });
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