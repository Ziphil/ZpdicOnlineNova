//

import {
  Request,
  Response
} from "express-serve-static-core";
import {
  UserModel
} from "../model/user";
import {
  UserLoginBody
} from "../type/user";
import {
  before,
  controller,
  get,
  post
} from "../util/decorator";
import "../util/extension";
import {
  Controller
} from "./controller";
import * as middle from "./middle";


@controller("/api/user")
export class UserController extends Controller {

  @get("/register")
  public getRegister(request: Request, response: Response): void {
    response.render("register.ejs");
  }

  @post("/register")
  public async postRegister(request: Request, response: Response<string>): Promise<void> {
    let name = request.body.name;
    let password = request.body.password;
    let email = request.body.email;
    let user = await UserModel.register(name, email, password);
    response.send("Registered: " + user.name);
  }

  @get("/login")
  public getLogin(request: Request, response: Response): void {
    response.render("login.ejs");
  }

  @post("/login")
  @before(middle.authenticate("1d"))
  public async postLogin(request: Request, response: Response<UserLoginBody>): Promise<void> {
    let token = request.token;
    let name = request.user?.name;
    response.json({token, name});
  }

  @get("/test")
  @before(middle.verifyToken())
  public async getTest(request: Request, response: Response<any>): Promise<void> {
    let user = request.user!;
    response.json({name: user.name, email: user.email});
  }

}