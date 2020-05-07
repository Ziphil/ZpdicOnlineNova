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
  getMailText
} from "/server/controller/mail-text";
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
  CastUtil
} from "/server/util/cast";
import {
  sendMail
} from "/server/util/misc";


@controller("/")
export class UserController extends Controller {

  @post(SERVER_PATH["login"])
  @before(login(30 * 24 * 60 * 60))
  public async [Symbol()](request: PostRequest<"login">, response: PostResponse<"login">): Promise<void> {
    let token = request.token!;
    let user = request.user!;
    let userBody = UserSkeleton.from(user);
    let body = {token, user: userBody};
    response.json(body);
  }

  @post(SERVER_PATH["logout"])
  @before(logout())
  public async [Symbol()](request: PostRequest<"logout">, response: PostResponse<"logout">): Promise<void> {
    response.json({});
  }

  @post(SERVER_PATH["registerUser"])
  public async [Symbol()](request: PostRequest<"registerUser">, response: PostResponse<"registerUser">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    let password = CastUtil.ensureString(request.body.password);
    try {
      let user = await UserModel.register(name, email, password);
      let body = UserSkeleton.from(user);
      let subject = "ユーザー登録完了のお知らせ";
      let text = getMailText("registerUser", {name});
      sendMail(user.email, subject, text);
      response.send(body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "duplicateUserName") {
            return CustomErrorSkeleton.ofType("duplicateUserName");
          } else if (error.type === "duplicateUserEmail") {
            return CustomErrorSkeleton.ofType("duplicateUserEmail");
          } else if (error.type === "invalidPassword") {
            return CustomErrorSkeleton.ofType("invalidPassword");
          }
        } else if (error.name === "ValidationError") {
          if (error.errors.name) {
            return CustomErrorSkeleton.ofType("invalidUserName");
          } else if (error.errors.email) {
            return CustomErrorSkeleton.ofType("invalidEmail");
          }
        }
      })();
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @post(SERVER_PATH["changeUserEmail"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"changeUserEmail">, response: PostResponse<"changeUserEmail">): Promise<void> {
    let user = request.user!;
    let email = CastUtil.ensureString(request.body.email);
    try {
      await user.changeEmail(email);
      let body = UserSkeleton.from(user);
      response.send(body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "duplicateUserEmail") {
          return CustomErrorSkeleton.ofType("duplicateUserEmail");
        } else if (error.name === "ValidationError" && error.errors.email) {
          return CustomErrorSkeleton.ofType("invalidEmail");
        }
      })();
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @post(SERVER_PATH["changeUserPassword"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"changeUserPassword">, response: PostResponse<"changeUserPassword">): Promise<void> {
    let user = request.user!;
    let password = CastUtil.ensureString(request.body.password);
    try {
      await user.changePassword(password);
      let body = UserSkeleton.from(user);
      response.send(body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "invalidPassword") {
          return CustomErrorSkeleton.ofType("invalidPassword");
        }
      })();
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @post(SERVER_PATH["issueUserResetToken"])
  public async [Symbol()](request: PostRequest<"issueUserResetToken">, response: PostResponse<"issueUserResetToken">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    try {
      let {user, key} = await UserModel.issueResetToken(name, email);
      let url = "http://" + request.get("host") + "/reset?key=" + key;
      let subject = "パスワードリセットのお知らせ";
      let text = getMailText("issueUserResetToken", {url});
      sendMail(user.email, subject, text);
      response.send({});
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "noSuchUser") {
          return CustomErrorSkeleton.ofType("noSuchUser");
        }
      })();
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @post(SERVER_PATH["resetUserPassword"])
  public async [Symbol()](request: PostRequest<"resetUserPassword">, response: PostResponse<"resetUserPassword">): Promise<void> {
    let key = CastUtil.ensureString(request.body.key);
    let password = CastUtil.ensureString(request.body.password);
    try {
      let user = await UserModel.resetPassword(key, password, 60);
      let body = UserSkeleton.from(user);
      response.send(body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "invalidResetToken") {
            return CustomErrorSkeleton.ofType("invalidResetToken");
          } else if (error.type === "invalidPassword") {
            return CustomErrorSkeleton.ofType("invalidPassword");
          }
        }
      })();
      if (body) {
        response.status(400).json(body);
      } else {
        throw error;
      }
    }
  }

  @get(SERVER_PATH["fetchUser"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"fetchUser">, response: GetResponse<"fetchUser">): Promise<void> {
    let user = request.user!;
    let body = UserSkeleton.from(user);
    response.json(body);
  }

}