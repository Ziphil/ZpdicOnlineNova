//

import {
  NextFunction,
  Request,
  Response
} from "express";
import {
  UserModel
} from "../model/user";
import * as middle from "./middle";
import {
  Controller
} from "./util/class";
import {
  before,
  controller,
  get,
  post
} from "./util/decorator";


@controller("/user")
export class UserController extends Controller {

  @get("/")
  @before(middle.checkSession)
  private getPage(request: Request, response: Response): void {
    let name = request.session!.name;
    response.render("user.ejs", {name});
  }

  @get("/register")
  private getRegister(request: Request, response: Response): void {
    response.render("register.ejs");
  }

  @post("/register")
  private async postRegister(request: Request, response: Response): Promise<void> {
    let name = request.body.name;
    let password = request.body.password;
    let email = request.body.email;
    let user = await UserModel.register(name, email, password);
    response.send("Registered: " + user.name);
  }

  @get("/login")
  private getLogin(request: Request, response: Response): void {
    response.render("login.ejs");
  }

  @post("/login")
  private async postLogin(request: Request, response: Response): Promise<void> {
    let name = request.body.name;
    let password = request.body.password;
    let user = await UserModel.authenticate(name, password);
    if (user) {
      request.session!.name = user.name;
      response.send("Login succeeded");
    } else {
      response.send("Login failed");
    }
  }

  @get("/logout")
  private getLogout(request: Request, response: Response): void {
    request.session!.destroy(() => null);
    response.send("Logout");
  }

  @get("/debug")
  private getDebug(request: Request, response: Response): void {
    response.send("Debugging");
  }

}