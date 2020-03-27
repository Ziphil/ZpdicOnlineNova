//

import {
  Controller,
  GetRequest,
  GetResponse,
  PostRequest,
  PostResponse
} from "/server/controller/controller";
import {
  before,
  controller,
  get,
  post
} from "/server/controller/decorator";
import {
  login,
  logout,
  verifyUser
} from "/server/controller/middle";
import {
  SERVER_PATH
} from "/server/controller/type";
import {
  UserModel
} from "/server/model/user";
import {
  CustomErrorSkeleton
} from "/server/skeleton/error";
import {
  UserSkeleton
} from "/server/skeleton/user";
import {
  ensureString
} from "/server/util/cast";


@controller("/")
export class UserController extends Controller {

  @post(SERVER_PATH["login"])
  @before(login(30 * 24 * 60 * 60))
  public async postLogin(request: PostRequest<"login">, response: PostResponse<"login">): Promise<void> {
    let token = request.token!;
    let user = request.user!;
    let userBody = UserSkeleton.from(user);
    let body = {token, user: userBody};
    response.json(body);
  }

  @post(SERVER_PATH["logout"])
  @before(logout())
  public async postLogout(request: PostRequest<"logout">, response: PostResponse<"logout">): Promise<void> {
    response.json(true);
  }

  @post(SERVER_PATH["registerUser"])
  public async postRegisterUser(request: PostRequest<"registerUser">, response: PostResponse<"registerUser">): Promise<void> {
    let name = ensureString(request.body.name);
    let email = ensureString(request.body.email);
    let password = ensureString(request.body.password);
    try {
      let user = await UserModel.register(name, email, password);
      let body = UserSkeleton.from(user);
      response.send(body);
    } catch (error) {
      let body;
      if (error.name === "CustomError") {
        if (error.type === "duplicateUserName") {
          body = CustomErrorSkeleton.ofType("duplicateUserName");
        } else if (error.type === "invalidPassword") {
          body = CustomErrorSkeleton.ofType("invalidPassword");
        }
      } else if (error.name === "ValidationError") {
        if (error.errors.name) {
          body = CustomErrorSkeleton.ofType("invalidUserName");
        } else if (error.errors.email) {
          body = CustomErrorSkeleton.ofType("invalidEmail");
        }
      }
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @post(SERVER_PATH["changeUserEmail"])
  @before(verifyUser())
  public async postChangeUserEmail(request: PostRequest<"changeUserEmail">, response: PostResponse<"changeUserEmail">): Promise<void> {
    let user = request.user!;
    let email = ensureString(request.body.email);
    try {
      await user.changeEmail(email);
      let body = UserSkeleton.from(user);
      response.send(body);
    } catch (error) {
      let body;
      if (error.name === "ValidationError" && error.errors.email) {
        body = CustomErrorSkeleton.ofType("invalidEmail");
      }
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @post(SERVER_PATH["changeUserPassword"])
  @before(verifyUser())
  public async postChangeUserPassword(request: PostRequest<"changeUserPassword">, response: PostResponse<"changeUserPassword">): Promise<void> {
    let user = request.user!;
    let password = ensureString(request.body.password);
    try {
      await user.changePassword(password);
      let body = UserSkeleton.from(user);
      response.send(body);
    } catch (error) {
      let body;
      if (error.name === "CustomError" && error.type === "invalidPassword") {
        body = CustomErrorSkeleton.ofType("invalidPassword");
      }
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @get(SERVER_PATH["fetchUserInfo"])
  @before(verifyUser())
  public async getFetchUserInfo(request: GetRequest<"fetchUserInfo">, response: GetResponse<"fetchUserInfo">): Promise<void> {
    let user = request.user!;
    let body = UserSkeleton.from(user);
    response.json(body);
  }

}