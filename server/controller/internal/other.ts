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
  verifyRecaptcha
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  UserModel
} from "/server/model/user";
import {
  MailUtil
} from "/server/util/mail";


@controller(SERVER_PATH_PREFIX)
export class OtherController extends Controller {

  @post(SERVER_PATHS["contact"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: Request<"contact">, response: Response<"contact">): Promise<void> {
    let name = request.body.name;
    let email = request.body.email;
    let subject = request.body.subject;
    let text = request.body.text;
    if (text !== "") {
      let user = await UserModel.fetchOneAdministrator();
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