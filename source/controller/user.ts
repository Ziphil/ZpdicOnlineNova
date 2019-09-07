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

  private getPage(request: Request, response: Response): void {
    let name = request.session!.name;
    response.render("user.ejs", {name});
  }

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

  private getLogin(request: Request, response: Response): void {
    response.render("login.ejs");
  }

  private postLogin(request: Request, response: Response): void {
    let name = request.body.name;
    let password = request.body.password;
    User.findOne({name, password}).exec().then((user) => {
      if (user) {
        request.session!.name = user.name;
        response.send("Login succeeded");
      } else {
        response.send("Login failed");
      }
    });
  }

  private getLogout(request: Request, response: Response): void {
    request.session!.destroy(() => null);
    response.send("Logout");
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
    router.get("/", this.checkSession, this.getPage);
    router.get("/register", this.getRegister);
    router.post("/register", this.postRegister);
    router.get("/login", this.getLogin);
    router.post("/login", this.postLogin);
    router.get("/logout", this.getLogout);
    router.get("/debug", this.getDebug);
  }

}