//

import {
  NextFunction,
  Request,
  Response
} from "express";
import * as jwt from "jsonwebtoken";
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
import "./util/extension";


@controller("/api/user")
export class UserController extends Controller {

  @get("/")
  @before(middle.checkLogin("/"))
  private getPage(request: Request, response: Response): void {
    let user = request.user!;
    response.render("user.ejs", {name: user.name});
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
  @before(middle.authenticate("1d"))
  private async postLogin(request: Request, response: Response): Promise<void> {
    let token = request.token;
    response.json(token);
  }

  @get("/test")
  @before(middle.verifyToken())
  private async getTest(request: Request, response: Response): Promise<void> {
    let user = request.user!;
    response.json({name: user.name, email: user.email});
  }

  @get("/logout")
  private getLogout(request: Request, response: Response): void {
    request.logout();
    response.send("Logout");
  }

  @get("/debug")
  private getDebug(request: Request, response: Response): void {
    response.send("Debugging");
  }

}