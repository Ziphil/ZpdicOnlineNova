//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {login, logout, verifyMe, verifyRecaptcha} from "/server/controller/internal/middle";
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
    const me = request.me!;
    const userBody = UserCreator.createDetailed(me);
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
      if (error.name === "ValidationError") {
        if (error.errors.name) {
          Controller.respondError(response, "invalidUserName");
        } else if (error.errors.email) {
          Controller.respondError(response, "invalidUserEmail");
        } else {
          throw error;
        }
      } else {
        Controller.respondByCustomError(response, ["duplicateUserName", "duplicateUserEmail", "invalidUserPassword"], error);
      }
    }
  }

  @post("/changeMyScreenName")
  @before(verifyMe())
  public async [Symbol()](request: Request<"changeMyScreenName">, response: Response<"changeMyScreenName">): Promise<void> {
    const me = request.me!;
    const screenName = request.body.screenName;
    try {
      await me.changeScreenName(screenName);
      const body = UserCreator.create(me);
      Controller.respond(response, body);
    } catch (error) {
      throw error;
    }
  }

  @post("/changeMyEmail")
  @before(verifyMe())
  public async [Symbol()](request: Request<"changeMyEmail">, response: Response<"changeMyEmail">): Promise<void> {
    const me = request.me!;
    const email = request.body.email;
    try {
      await me.changeEmail(email);
      const body = UserCreator.create(me);
      Controller.respond(response, body);
    } catch (error) {
      if (error.name === "ValidationError" && error.errors.email) {
        Controller.respondError(response, "invalidUserEmail");
      } else {
        Controller.respondByCustomError(response, ["duplicateUserEmail"], error);
      }
    }
  }

  @post("/changeMyPassword")
  @before(verifyMe())
  public async [Symbol()](request: Request<"changeMyPassword">, response: Response<"changeMyPassword">): Promise<void> {
    const me = request.me!;
    const password = request.body.password;
    try {
      await me.changePassword(password);
      const body = UserCreator.create(me);
      Controller.respond(response, body);
    } catch (error) {
      Controller.respondByCustomError(response, ["invalidUserPassword"], error);
    }
  }

  @post("/issueMyActivateToken")
  @before(verifyRecaptcha(), verifyMe())
  public async [Symbol()](request: Request<"issueMyActivateToken">, response: Response<"issueMyActivateToken">): Promise<void> {
    const me = request.me!;
    try {
      const key = await me.issueActivateToken();
      const url = `${request.protocol}://${request.get("host")}/activate?key=${key}`;
      const subject = MailUtil.getSubject("issueMyActivateToken");
      const text = MailUtil.getText("issueMyActivateToken", {url});
      MailUtil.send(me.email, subject, text);
      Controller.respond(response, null);
    } catch (error) {
      Controller.respondByCustomError(response, ["noSuchUser", "userAlreadyActivated"], error);
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
      Controller.respondByCustomError(response, ["noSuchUser"], error);
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
      Controller.respondByCustomError(response, ["invalidActivateToken"], error);
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
      Controller.respondByCustomError(response, ["invalidResetToken", "invalidUserPassword"], error);
    }
  }

  @post("/discardMe")
  @before(verifyMe())
  public async [Symbol()](request: Request<"discardMe">, response: Response<"discardMe">): Promise<void> {
    const me = request.me!;
    try {
      await me.discard();
      Controller.respond(response, null);
    } catch (error) {
      throw error;
    }
  }

  @post("/fetchMe")
  @before(verifyMe())
  public async [Symbol()](request: Request<"fetchMe">, response: Response<"fetchMe">): Promise<void> {
    const me = request.me!;
    const body = UserCreator.createDetailed(me);
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
      Controller.respondError(response, "noSuchUser");
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