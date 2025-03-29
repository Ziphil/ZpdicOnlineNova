//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/base";
import {checkMe, checkRecaptcha, login, logout} from "/server/internal/controller/rest/middleware";
import {UserCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {UserModel} from "/server/model";
import {AwsUtil} from "/server/util/aws";
import {MailUtil} from "/server/util/mail";


@restController(SERVER_PATH_PREFIX)
export class UserRestController extends InternalRestController {

  @post("/login")
  @before(login(30 * 24 * 60 * 60))
  public async [Symbol()](request: Request<"login">, response: Response<"login">): Promise<void> {
    const {me, token} = request.middlewareBody as FilledMiddlewareBody<"me" | "token">;
    const userBody = UserCreator.skeletonizeWithDetail(me);
    const body = {token, user: userBody};
    InternalRestController.respond(response, body);
  }

  @post("/logout")
  @before(logout())
  public async [Symbol()](request: Request<"logout">, response: Response<"logout">): Promise<void> {
    InternalRestController.respond(response, null);
  }

  @post("/registerUser")
  @before(checkRecaptcha())
  public async [Symbol()](request: Request<"registerUser">, response: Response<"registerUser">): Promise<void> {
    const {name, email, password} = request.body;
    try {
      const {user, key} = await UserModel.register(name, email, password);
      const url = `${request.protocol}://${request.get("host")}/activate?key=${key}`;
      const body = UserCreator.skeletonize(user);
      const subject = MailUtil.getSubject("registerUser");
      const text = MailUtil.getText("registerUser", {name, url});
      MailUtil.send(user.email, subject, text);
      InternalRestController.respond(response, body);
    } catch (error) {
      if (error.name === "ValidationError") {
        if (error.errors.name) {
          InternalRestController.respondError(response, "invalidUserName");
        } else if (error.errors.email) {
          InternalRestController.respondError(response, "invalidUserEmail");
        } else {
          throw error;
        }
      } else {
        InternalRestController.respondByCustomError(response, ["duplicateUserName", "duplicateUserEmail", "invalidUserPassword"], error);
      }
    }
  }

  @post("/changeMyScreenName")
  @before(checkMe())
  public async [Symbol()](request: Request<"changeMyScreenName">, response: Response<"changeMyScreenName">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {screenName} = request.body;
    try {
      await me.changeScreenName(screenName);
      const body = UserCreator.skeletonize(me);
      InternalRestController.respond(response, body);
    } catch (error) {
      throw error;
    }
  }

  @post("/changeMyEmail")
  @before(checkMe())
  public async [Symbol()](request: Request<"changeMyEmail">, response: Response<"changeMyEmail">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {email} = request.body;
    try {
      await me.changeEmail(email);
      const body = UserCreator.skeletonize(me);
      InternalRestController.respond(response, body);
    } catch (error) {
      if (error.name === "ValidationError" && error.errors.email) {
        InternalRestController.respondError(response, "invalidUserEmail");
      } else {
        InternalRestController.respondByCustomError(response, ["duplicateUserEmail"], error);
      }
    }
  }

  @post("/changeMyPassword")
  @before(checkMe())
  public async [Symbol()](request: Request<"changeMyPassword">, response: Response<"changeMyPassword">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {password} = request.body;
    try {
      await me.changePassword(password);
      const body = UserCreator.skeletonize(me);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["invalidUserPassword"], error);
    }
  }

  @post("/issueMyActivateToken")
  @before(checkRecaptcha(), checkMe())
  public async [Symbol()](request: Request<"issueMyActivateToken">, response: Response<"issueMyActivateToken">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    try {
      const key = await me.issueActivateToken();
      const url = `${request.protocol}://${request.get("host")}/activate?key=${key}`;
      const subject = MailUtil.getSubject("issueMyActivateToken");
      const text = MailUtil.getText("issueMyActivateToken", {url});
      MailUtil.send(me.email, subject, text);
      InternalRestController.respond(response, null);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["noSuchUser", "userAlreadyActivated"], error);
    }
  }

  @post("/issueUserResetToken")
  @before(checkRecaptcha())
  public async [Symbol()](request: Request<"issueUserResetToken">, response: Response<"issueUserResetToken">): Promise<void> {
    const {email} = request.body;
    try {
      const {user, key} = await UserModel.issueResetToken(email);
      const url = `${request.protocol}://${request.get("host")}/reset?key=${key}`;
      const subject = MailUtil.getSubject("issueUserResetToken");
      const text = MailUtil.getText("issueUserResetToken", {url});
      MailUtil.send(user.email, subject, text);
      InternalRestController.respond(response, null);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["noSuchUser"], error);
    }
  }

  @post("/activateMe")
  public async [Symbol()](request: Request<"activateMe">, response: Response<"activateMe">): Promise<void> {
    const {key} = request.body;
    try {
      const user = await UserModel.activate(key, 60);
      const body = UserCreator.skeletonize(user);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["invalidActivateToken"], error);
    }
  }

  @post("/resetUserPassword")
  public async [Symbol()](request: Request<"resetUserPassword">, response: Response<"resetUserPassword">): Promise<void> {
    const {key, password} = request.body;
    try {
      const user = await UserModel.resetPassword(key, password, 60);
      const body = UserCreator.skeletonize(user);
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondByCustomError(response, ["invalidResetToken", "invalidUserPassword"], error);
    }
  }

  @post("/discardMe")
  @before(checkMe())
  public async [Symbol()](request: Request<"discardMe">, response: Response<"discardMe">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    try {
      await me.discard();
      InternalRestController.respond(response, null);
    } catch (error) {
      throw error;
    }
  }

  @post("/fetchMe")
  @before(checkMe())
  public async [Symbol()](request: Request<"fetchMe">, response: Response<"fetchMe">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const body = UserCreator.skeletonizeWithDetail(me);
    InternalRestController.respond(response, body);
  }

  @post("/fetchUser")
  public async [Symbol()](request: Request<"fetchUser">, response: Response<"fetchUser">): Promise<void> {
    const {id, name} = request.body;
    const user = (id !== undefined) ? await UserModel.findById(id) : await UserModel.fetchOneByName(name ?? "");
    if (user) {
      const body = UserCreator.skeletonize(user);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchUser");
    }
  }

  @post("/fetchUploadMyAvatarPost")
  @before(checkRecaptcha(), checkMe())
  public async [Symbol()](request: Request<"fetchUploadMyAvatarPost">, response: Response<"fetchUploadMyAvatarPost">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    try {
      const path = `avatar/${me.name}/avatar`;
      const configs = {contentType: "image/", sizeLimit: 1024 * 1024};
      const post = await AwsUtil.getUploadFilePost(path, configs);
      const body = post;
      InternalRestController.respond(response, body);
    } catch (error) {
      InternalRestController.respondError(response, "awsError");
    }
  }

  @post("/suggestUsers")
  public async [Symbol()](request: Request<"suggestUsers">, response: Response<"suggestUsers">): Promise<void> {
    const {pattern} = request.body;
    const users = await UserModel.suggest(pattern);
    const body = users.map(UserCreator.skeletonize);
    InternalRestController.respond(response, body);
  }

}