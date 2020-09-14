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
  SERVER_PATH
} from "/server/controller/type";
import {
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
export class OtherController extends Controller {

  @post(SERVER_PATH["contact"])
  public async [Symbol()](request: PostRequest<"contact">, response: PostResponse<"contact">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    let subject = CastUtil.ensureString(request.body.subject);
    let text = CastUtil.ensureString(request.body.text);
    let token = CastUtil.ensureString(request.body.token);
    try {
      let result = await RecaptchaUtil.verify(token);
      if (result.score >= 0.5) {
        let user = await UserModel.findOneAdministrator();
        if (user !== null) {
          let nextSubject = MailUtil.getSubject("contact", {subject});
          let nextText = MailUtil.getText("contact", {name, email, subject, text});
          MailUtil.send(user.email, nextSubject, nextText);
          Controller.respond(response, null);
        } else {
          let body = CustomError.ofType("administratorNotFound");
          Controller.respondError(response, body);
        }
      } else {
        let body = CustomError.ofType("recaptchaRejected");
        Controller.respondError(response, body);
      }
    } catch (error) {
      let body = (() => {
        if (error.name === "CustomError" && error.type === "recaptchaError") {
          return CustomError.ofType("recaptchaError");
        }
      })();
      Controller.respondError(response, body, error);
    }
  }

}