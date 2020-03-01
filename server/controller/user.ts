//

import {
  Request,
  Response
} from "express-serve-static-core";
import {
  Controller
} from "/server/controller/controller";
import * as middle from "/server/controller/middle";
import {
  UserModel
} from "/server/model/user";
import {
  UserBody,
  UserLoginBody
} from "/server/type/user";
import {
  before,
  controller,
  get,
  post
} from "/server/util/decorator";
import "/server/util/extension";


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

  @get("/info")
  @before(middle.verifyToken())
  public async getInfo(request: Request, response: Response<UserBody>): Promise<void> {
    let user = request.user!;
    let name = user.name;
    let email = user.email;
    response.json({name, email});
  }

}