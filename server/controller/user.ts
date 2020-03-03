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
  CustomErrorSkeleton,
  MayError
} from "/server/model/error";
import {
  UserModel,
  UserSkeleton
} from "/server/model/user";
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
  public async postRegister(request: Request, response: Response<UserRegisterBody>): Promise<void> {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    try {
      let user = await UserModel.register(name, email, password);
      let body = new UserSkeleton(user);
      response.send(body);
    } catch (error) {
      if (error.name === "CustomError") {
        let body = new CustomErrorSkeleton(error.type);
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @get("/login")
  public getLogin(request: Request, response: Response): void {
    response.render("login.ejs");
  }

  @post("/login")
  @before(middle.authenticate("1y"))
  public async postLogin(request: Request, response: Response<UserLoginBody>): Promise<void> {
    let token = request.token;
    let user = request.user;
    if (token && user) {
      let rawBody = new UserSkeleton(user);
      let body = {...rawBody, token};
      response.json(body);
    } else {
      let body = new CustomErrorSkeleton("invalidRequest");
      response.status(400).json(body);
    }
  }

  @get("/info")
  @before(middle.verifyToken())
  public async getInfo(request: Request, response: Response<UserInfoBody>): Promise<void> {
    let user = request.user!;
    let body = new UserSkeleton(user);
    response.json(body);
  }

}


export type UserRegisterBody = MayError<UserSkeleton>;
export type UserLoginBody = MayError<UserSkeleton & {token: string}>;
export type UserInfoBody = UserSkeleton;