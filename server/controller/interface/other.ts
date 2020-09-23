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
  verifyRecaptcha
} from "/server/controller/middle";
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


@controller("/")
export class OtherController extends Controller {

  @post(SERVER_PATH["contact"])
  @before(verifyRecaptcha())
  public async [Symbol()](request: PostRequest<"contact">, response: PostResponse<"contact">): Promise<void> {
    let name = CastUtil.ensureString(request.body.name);
    let email = CastUtil.ensureString(request.body.email);
    let subject = CastUtil.ensureString(request.body.subject);
    let text = CastUtil.ensureString(request.body.text);
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
  }

}