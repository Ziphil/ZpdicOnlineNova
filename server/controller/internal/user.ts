//

import {
  CustomError
} from "/client/skeleton/error";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  Controller,
  Request,
  Response
} from "/server/controller/internal/controller";
import {
  login,
  logout,
  verifyRecaptcha,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  UserCreator,
  UserModel
} from "/server/model/user";
import {
  MailUtil
} from "/server/util/mail";


@controller(SERVER_PATH_PREFIX)
export class UserController extends Controller {

  @post(SERVER_PATHS["login"])
  @before(login(30 * 24 * 60 * 60))
  public async [Symbol()](request: Request<"login">, response: Response<"login">): Promise<void> {
    let token = request.token!;
    let user = request.user!;
    let userBody = UserCreator.createDetailed(user);
    let body = {token, user: userBody};
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["logout"])
  @before(logout())
  public async [Symbol()](request: Request<"logout">, response: Response<"logout">): Promise<void> {
    Controller.respond(response, null);
  }

  @post(SERVER_PATHS["registerUser"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"registerUser">, response: Response<"registerUser">): Promise<void> {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    try {
      let {user, key} = await UserModel.register(name, email, password);
      let url = `${request.protocol}://${request.hostname}/activate?key=${key}`;
      let body = UserCreator.create(user);
      let subject = MailUtil.getSubject("registerUser");
      let text = MailUtil.getText("registerUser", {name, url});
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

  @post(SERVER_PATHS["changeUserScreenName"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"changeUserScreenName">, response: Response<"changeUserScreenName">): Promise<void> {
    let user = request.user!;
    let screenName = request.body.screenName;
    try {
      await user.changeScreenName(screenName);
      let body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      Controller.respondError(response, undefined, error);
    }
  }

  @post(SERVER_PATHS["changeUserEmail"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"changeUserEmail">, response: Response<"changeUserEmail">): Promise<void> {
    let user = request.user!;
    let email = request.body.email;
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

  @post(SERVER_PATHS["changeUserPassword"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"changeUserPassword">, response: Response<"changeUserPassword">): Promise<void> {
    let user = request.user!;
    let password = request.body.password;
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

  @post(SERVER_PATHS["issueUserResetToken"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"issueUserResetToken">, response: Response<"issueUserResetToken">): Promise<void> {
    let name = request.body.name;
    let email = request.body.email;
    try {
      let {user, key} = await UserModel.issueResetToken(name, email);
      let url = `${request.protocol}://${request.hostname}/reset?key=${key}`;
      let subject = MailUtil.getSubject("issueUserResetToken");
      let text = MailUtil.getText("issueUserResetToken", {url});
      MailUtil.send(user.email, subject, text);
      Controller.respond(response, null);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "noSuchUser") {
            return CustomError.ofType("noSuchUser");
          }
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATHS["resetUserPassword"])
  public async [Symbol()](request: Request<"resetUserPassword">, response: Response<"resetUserPassword">): Promise<void> {
    let key = request.body.key;
    let password = request.body.password;
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

  @post(SERVER_PATHS["activateUser"])
  public async [Symbol()](request: Request<"activateUser">, response: Response<"activateUser">): Promise<void> {
    let key = request.body.key;
    try {
      let user = await UserModel.activate(key);
      let body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "invalidActivateToken") {
            return CustomError.ofType("invalidActivateToken");
          }
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATHS["discardUser"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"discardUser">, response: Response<"discardUser">): Promise<void> {
    let user = request.user!;
    try {
      await user.discard();
      Controller.respond(response, null);
    } catch (error) {
      Controller.respondError(response, undefined, error);
    }
  }

  @post(SERVER_PATHS["fetchUser"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchUser">, response: Response<"fetchUser">): Promise<void> {
    let user = request.user!;
    let body = UserCreator.createDetailed(user);
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["suggestUsers"])
  public async [Symbol()](request: Request<"suggestUsers">, response: Response<"suggestUsers">): Promise<void> {
    let pattern = request.body.pattern;
    let users = await UserModel.suggest(pattern);
    let body = users.map(UserCreator.create);
    Controller.respond(response, body);
  }

}