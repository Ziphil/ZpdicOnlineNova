//

import {CustomError} from "/client/skeleton";
import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {login, logout, verifyRecaptcha, verifyUser} from "/server/controller/internal/middle";
import {UserCreator} from "/server/creator";
import {UserModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {MailUtil} from "/server/util/mail";


@controller(SERVER_PATH_PREFIX)
export class UserController extends Controller {

  @post("/login")
  @before(login(30 * 24 * 60 * 60))
  public async [Symbol()](request: Request<"login">, response: Response<"login">): Promise<void> {
    const token = request.token!;
    const user = request.user!;
    const userBody = UserCreator.createDetailed(user);
    const body = {token, user: userBody};
    Controller.respond(response, body);
  }

  @post("/logout")
  @before(logout())
  public async [Symbol()](request: Request<"logout">, response: Response<"logout">): Promise<void> {
    Controller.respond(response, null);
  }

  @post("/registerUser")
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"registerUser">, response: Response<"registerUser">): Promise<void> {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    try {
      const {user, key} = await UserModel.register(name, email, password);
      const url = `${request.protocol}://${request.get("host")}/activate?key=${key}`;
      const body = UserCreator.create(user);
      const subject = MailUtil.getSubject("registerUser");
      const text = MailUtil.getText("registerUser", {name, url});
      MailUtil.send(user.email, subject, text);
      Controller.respond(response, body);
    } catch (error) {
      const body = (() => {
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

  @post("/changeMyScreenName")
  @before(verifyUser())
  public async [Symbol()](request: Request<"changeMyScreenName">, response: Response<"changeMyScreenName">): Promise<void> {
    const user = request.user!;
    const screenName = request.body.screenName;
    try {
      await user.changeScreenName(screenName);
      const body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      Controller.respondError(response, undefined, error);
    }
  }

  @post("/changeMyEmail")
  @before(verifyUser())
  public async [Symbol()](request: Request<"changeMyEmail">, response: Response<"changeMyEmail">): Promise<void> {
    const user = request.user!;
    const email = request.body.email;
    try {
      await user.changeEmail(email);
      const body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      const body = (() => {
        if (error.name === "CustomError" && error.type === "duplicateUserEmail") {
          return CustomError.ofType("duplicateUserEmail");
        } else if (error.name === "ValidationError" && error.errors.email) {
          return CustomError.ofType("invalidUserEmail");
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post("/changeMyPassword")
  @before(verifyUser())
  public async [Symbol()](request: Request<"changeMyPassword">, response: Response<"changeMyPassword">): Promise<void> {
    const user = request.user!;
    const password = request.body.password;
    try {
      await user.changePassword(password);
      const body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      const body = (() => {
        if (error.name === "CustomError" && error.type === "invalidUserPassword") {
          return CustomError.ofType("invalidUserPassword");
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post("/issueMyActivateToken")
  @before(verifyRecaptcha(), verifyUser())
  public async [Symbol()](request: Request<"issueMyActivateToken">, response: Response<"issueMyActivateToken">): Promise<void> {
    const user = request.user!;
    try {
      const key = await user.issueActivateToken();
      const url = `${request.protocol}://${request.get("host")}/activate?key=${key}`;
      const subject = MailUtil.getSubject("issueMyActivateToken");
      const text = MailUtil.getText("issueMyActivateToken", {url});
      MailUtil.send(user.email, subject, text);
      Controller.respond(response, null);
    } catch (error) {
      const body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "noSuchUser") {
            return CustomError.ofType("noSuchUser");
          } else if (error.type === "userAlreadyActivated") {
            return CustomError.ofType("userAlreadyActivated");
          }
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post("/issueUserResetToken")
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"issueUserResetToken">, response: Response<"issueUserResetToken">): Promise<void> {
    const name = request.body.name;
    const email = request.body.email;
    try {
      const {user, key} = await UserModel.issueResetToken(name, email);
      const url = `${request.protocol}://${request.get("host")}/reset?key=${key}`;
      const subject = MailUtil.getSubject("issueUserResetToken");
      const text = MailUtil.getText("issueUserResetToken", {url});
      MailUtil.send(user.email, subject, text);
      Controller.respond(response, null);
    } catch (error) {
      const body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "noSuchUser") {
            return CustomError.ofType("noSuchUser");
          }
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post("/activateMe")
  public async [Symbol()](request: Request<"activateMe">, response: Response<"activateMe">): Promise<void> {
    const key = request.body.key;
    try {
      const user = await UserModel.activate(key, 60);
      const body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      const body = (() => {
        if (error.name === "CustomError") {
          if (error.type === "invalidActivateToken") {
            return CustomError.ofType("invalidActivateToken");
          }
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

  @post("/resetUserPassword")
  public async [Symbol()](request: Request<"resetUserPassword">, response: Response<"resetUserPassword">): Promise<void> {
    const key = request.body.key;
    const password = request.body.password;
    try {
      const user = await UserModel.resetPassword(key, password, 60);
      const body = UserCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      const body = (() => {
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

  @post("/discardMe")
  @before(verifyUser())
  public async [Symbol()](request: Request<"discardMe">, response: Response<"discardMe">): Promise<void> {
    const user = request.user!;
    try {
      await user.discard();
      Controller.respond(response, null);
    } catch (error) {
      Controller.respondError(response, undefined, error);
    }
  }

  @post("/fetchMe")
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchMe">, response: Response<"fetchMe">): Promise<void> {
    const user = request.user!;
    const body = UserCreator.createDetailed(user);
    Controller.respond(response, body);
  }

  @post("/fetchUser")
  public async [Symbol()](request: Request<"fetchUser">, response: Response<"fetchUser">): Promise<void> {
    const name = request.body.name;
    const user = await UserModel.fetchOneByName(name);
    if (user !== null) {
      const body = UserCreator.create(user);
      Controller.respond(response, body);
    } else {
      const body = CustomError.ofType("noSuchUser");
      Controller.respondError(response, body);
    }
  }

  @post("/suggestUsers")
  public async [Symbol()](request: Request<"suggestUsers">, response: Response<"suggestUsers">): Promise<void> {
    const pattern = request.body.pattern;
    const users = await UserModel.suggest(pattern);
    const body = users.map(UserCreator.create);
    Controller.respond(response, body);
  }

}