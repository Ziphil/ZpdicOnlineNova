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

  private getRegister(request: Request, response: Response): void {
    response.render("register.ejs");
  }

  private postRegister(request: Request, response: Response): void {
    let name = request.body.name;
    let password = request.body.password;
    let email = request.body.email;
    let user = new User({name, password, email});
    user.save().then(() => {
      response.send("Registered");
    });
  }

  private getDebug(request: Request, response: Response): void {
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
    router.get("/register", this.getRegister);
    router.post("/register", this.postRegister);
    router.get("/debug", this.getDebug);
  }

}