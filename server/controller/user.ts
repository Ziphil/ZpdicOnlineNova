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
  UserCreator,
  UserModel
} from "/server/model/user";
import {
  CustomError
} from "/server/skeleton/error";
import {
  CastUtil
} from "/server/util/cast";
import {
  MailUtil
} from "/server/util/mail";
import {
  RecaptchaUtil
} from "/server/util/recapthca";


@controller("/")
export class UserController extends Controller {

  @post(SERVER_PATH["login"])
  @before(login(30 * 24 * 60 * 60))
  public async [Symbol()](request: PostRequest<"login">, response: PostResponse<"login">): Promise<void> {
    let token = request.token!;
    let user = request.user!;
    let userBody = UserCreator.createDetailed(user);
    let body = {token, user: userBody};
    Controller.response(response, body);
  }

  @post(SERVER_PATH["logout"])
  @before(logout())
  public async [Symbol()](request: PostRequest<"logout">, response: PostResponse<"logout">): Promise<void> {
    Controller.response(response, null);
  }

  @post(SERVER_PATH["registerUser"])
  public async [Symbol()](request: PostRequest<"registerUser">, response: PostResponse<"registerUser">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    let password = CastUtil.ensureString(request.body.password);
    let token = CastUtil.ensureString(request.body.token);
    try {
      let result = await RecaptchaUtil.verify(token);
      if (result.score >= 0.5) {
        let user = await UserModel.register(name, email, password);
        let body = UserCreator.create(user);
        let subject = MailUtil.getTitle("registerUser");
        let text = MailUtil.getText("registerUser", {name});
        MailUtil.send(user.email, subject, text);
        Controller.response(response, body);
      } else {
        let body = CustomError.ofType("recaptchaRejected");
        Controller.responseError(response, body);
      }
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "duplicateUserName") {
            return CustomError.ofType("duplicateUserName");
          } else if (error.type === "duplicateUserEmail") {
            return CustomError.ofType("duplicateUserEmail");
          } else if (error.type === "invalidPassword") {
            return CustomError.ofType("invalidPassword");
          } else if (error.type === "recaptchaError") {
            return CustomError.ofType("recaptchaError");
          }
        } else if (error.name === "ValidationError") {
          if (error.errors.name) {
            return CustomError.ofType("invalidUserName");
          } else if (error.errors.email) {
            return CustomError.ofType("invalidEmail");
          }
        }
      })();
      Controller.responseError(response, body, error);
    }
  }

  @post(SERVER_PATH["changeUserEmail"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"changeUserEmail">, response: PostResponse<"changeUserEmail">): Promise<void> {
    let user = request.user!;
    let email = CastUtil.ensureString(request.body.email);
    try {
      await user.changeEmail(email);
      let body = UserCreator.create(user);
      Controller.response(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "duplicateUserEmail") {
          return CustomError.ofType("duplicateUserEmail");
        } else if (error.name === "ValidationError" && error.errors.email) {
          return CustomError.ofType("invalidEmail");
        }
      })();
      Controller.responseError(response, body, error);
    }
  }

  @post(SERVER_PATH["changeUserPassword"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"changeUserPassword">, response: PostResponse<"changeUserPassword">): Promise<void> {
    let user = request.user!;
    let password = CastUtil.ensureString(request.body.password);
    try {
      await user.changePassword(password);
      let body = UserCreator.create(user);
      Controller.response(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "invalidPassword") {
          return CustomError.ofType("invalidPassword");
        }
      })();
      Controller.responseError(response, body, error);
    }
  }

  @post(SERVER_PATH["issueUserResetToken"])
  public async [Symbol()](request: PostRequest<"issueUserResetToken">, response: PostResponse<"issueUserResetToken">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    let token = CastUtil.ensureString(request.body.token);
    try {
      let result = await RecaptchaUtil.verify(token);
      if (result.score >= 0.5) {
        let {user, key} = await UserModel.issueResetToken(name, email);
        let url = "http://" + request.get("host") + "/reset?key=" + key;
        let subject = MailUtil.getTitle("issueUserResetToken");
        let text = MailUtil.getText("issueUserResetToken", {url});
        MailUtil.send(user.email, subject, text);
        Controller.response(response, null);
      } else {
        let body = CustomError.ofType("recaptchaRejected");
        Controller.responseError(response, body);
      }
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "noSuchUser") {
            return CustomError.ofType("noSuchUser");
          } else if (error.type === "recaptchaError") {
            return CustomError.ofType("recaptchaError");
          }
        }
      })();
      Controller.responseError(response, body, error);
    }
  }

  @post(SERVER_PATH["resetUserPassword"])
  public async [Symbol()](request: PostRequest<"resetUserPassword">, response: PostResponse<"resetUserPassword">): Promise<void> {
    let key = CastUtil.ensureString(request.body.key);
    let password = CastUtil.ensureString(request.body.password);
    try {
      let user = await UserModel.resetPassword(key, password, 60);
      let body = UserCreator.create(user);
      Controller.response(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "invalidResetToken") {
            return CustomError.ofType("invalidResetToken");
          } else if (error.type === "invalidPassword") {
            return CustomError.ofType("invalidPassword");
          }
        }
      })();
      Controller.responseError(response, body, error);
    }
  }

  @get(SERVER_PATH["fetchUser"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"fetchUser">, response: GetResponse<"fetchUser">): Promise<void> {
    let user = request.user!;
    let body = UserCreator.createDetailed(user);
    Controller.response(response, body);
  }

}