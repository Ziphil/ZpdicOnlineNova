//

import {
  CustomError
} from "/client/skeleton/error";
import {
  Controller,
  Request,
  Response
} from "/server/controller/controller";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/interface/type";
import {
  verifyRecaptcha
} from "/server/controller/middle";
import {
  UserModel
} from "/server/model/user";
import {
  CastUtil
} from "/server/util/cast";
import {
  MailUtil
} from "/server/util/mail";


@controller(SERVER_PATH_PREFIX)
export class OtherController extends Controller {

  @post(SERVER_PATHS["contact"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"contact">, response: Response<"contact">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    let subject = CastUtil.ensureString(request.body.subject);
    let text = CastUtil.ensureString(request.body.text);
    if (text !== "") {
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
      let body = CustomError.ofType("emptyContactText");
      Controller.respondError(response, body);
    }
  }

}