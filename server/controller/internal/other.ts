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
  checkUser,
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

  @post(SERVER_PATHS["fetchDocument"])
  public async [Symbol()](request: Request<"fetchDocument">, response: Response<"fetchDocument">): Promise<void> {
    let locale = request.body.locale;
    let path = request.body.path;
    let localPath = `/dist/document/${locale}/${path || "index"}.md`;
    response.sendFile(process.cwd() + localPath, (error) => {
      if (error) {
        let body = CustomError.ofType("noSuchDocument");
        Controller.respondError(response, body);
      }
    });
  }

  @post(SERVER_PATHS["contact"])
  @before(checkUser(), verifyRecaptcha())
  public async [Symbol()](request: Request<"contact">, response: Response<"contact">): Promise<void> {
    let user = request.user;
    let name = request.body.name;
    let email = request.body.email;
    let subject = request.body.subject;
    let text = request.body.text;
    let signedIn = (user !== undefined).toString();
    let userName = user?.name ?? "";
    if (text !== "") {
      let administrator = await UserModel.fetchOneAdministrator();
      if (administrator !== null) {
        let nextSubject = MailUtil.getSubject("contact", {subject});
        let nextText = MailUtil.getText("contact", {userName, email, subject, text, signedIn, name});
        MailUtil.send(administrator.email, nextSubject, nextText);
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