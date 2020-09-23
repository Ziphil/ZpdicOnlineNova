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
  verifyRecaptcha,
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
} from "/server/util/recaptcha";


@controller("/")
export class UserController extends Controller {

  @post(SERVER_PATH["login"])
  @before(login(30 * 24 * 60 * 60))
  public async [Symbol()](request: PostRequest<"login">, response: PostResponse<"login">): Promise<void> {
    let token = request.token!;
    let user = request.user!;
    let userBody = UserCreator.createDetailed(user);
    let body = {token, user: userBody};
    Controller.respond(response, body);
  }

  @post(SERVER_PATH["logout"])
  @before(logout())
  public async [Symbol()](request: PostRequest<"logout">, response: PostResponse<"logout">): Promise<void> {
    Controller.respond(response, null);
  }

  @post(SERVER_PATH["registerUser"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: PostRequest<"registerUser">, response: PostResponse<"registerUser">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    let password = CastUtil.ensureString(request.body.password);
    try {
      let user = await UserModel.register(name, email, password);
      let body = UserCreator.create(user);
      let subject = MailUtil.getSubject("registerUser");
      let text = MailUtil.getText("registerUser", {name});
      MailUtil.send(user.email, subject, text);
      Controller.respond(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "duplicateUserName") {
            return CustomError.ofType("duplicateUserName");
          } else if (error.type === "duplicateUserEmail") {
            return CustomError.ofType("duplicateUserEmail");
          } else if (error.type === "invalidUserPassword") {
            return CustomError.ofType("invalidUserPassword");
          }
        } else if (error.name === "ValidationError") {
          if (error.errors.name) {
            return CustomError.ofType("invalidUserName");
          } else if (error.errors.email) {
            return CustomError.ofType("invalidUserEmail");
          }
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATH["changeUserScreenName"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"changeUserScreenName">, response: PostResponse<"changeUserScreenName">): Promise<void> {
    let user = request.user!;
    let screenName = CastUtil.ensureString(request.body.screenName);
    try {
      await user.changeScreenName(screenName);
      let body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      Controller.respondError(response, undefined, error);
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
      Controller.respond(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "duplicateUserEmail") {
          return CustomError.ofType("duplicateUserEmail");
        } else if (error.name === "ValidationError" && error.errors.email) {
          return CustomError.ofType("invalidUserEmail");
        }
      })();
      Controller.respondError(response, body, error);
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
      Controller.respond(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "invalidUserPassword") {
          return CustomError.ofType("invalidUserPassword");
        }
      })();
      Controller.respondError(response, body, error);
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
        let subject = MailUtil.getSubject("issueUserResetToken");
        let text = MailUtil.getText("issueUserResetToken", {url});
        MailUtil.send(user.email, subject, text);
        Controller.respond(response, null);
      } else {
        let body = CustomError.ofType("recaptchaRejected");
        Controller.respondError(response, body);
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
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATH["resetUserPassword"])
  public async [Symbol()](request: PostRequest<"resetUserPassword">, response: PostResponse<"resetUserPassword">): Promise<void> {
    let key = CastUtil.ensureString(request.body.key);
    let password = CastUtil.ensureString(request.body.password);
    try {
      let user = await UserModel.resetPassword(key, password, 60);
      let body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "invalidResetToken") {
            return CustomError.ofType("invalidResetToken");
          } else if (error.type === "invalidUserPassword") {
            return CustomError.ofType("invalidUserPassword");
          }
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATH["deleteUser"])
  @before(verifyUser())
  public async [Symbol()](request: PostRequest<"deleteUser">, response: PostResponse<"deleteUser">): Promise<void> {
    let user = request.user!;
    try {
      await user.removeWhole();
      Controller.respond(response, null);
    } catch (error) {
      Controller.respondError(response, undefined, error);
    }
  }

  @get(SERVER_PATH["fetchUser"])
  @before(verifyUser())
  public async [Symbol()](request: GetRequest<"fetchUser">, response: GetResponse<"fetchUser">): Promise<void> {
    let user = request.user!;
    let body = UserCreator.createDetailed(user);
    Controller.respond(response, body);
  }

  @get(SERVER_PATH["suggestUsers"])
  public async [Symbol()](request: GetRequest<"suggestUsers">, response: GetResponse<"suggestUsers">): Promise<void> {
    let pattern = CastUtil.ensureString(request.query.pattern);
    let users = await UserModel.suggest(pattern);
    let body = users.map(UserCreator.create);
    Controller.respond(response, body);
  }

}