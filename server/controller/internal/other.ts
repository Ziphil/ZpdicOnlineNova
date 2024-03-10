//

import {
  CustomError
} from "/client-new/skeleton";
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
    const locale = request.body.locale;
    const path = request.body.path;
    const localPath = `/dist/document/${locale}/${path || "index"}.md`;
    response.sendFile(process.cwd() + localPath, (error) => {
      if (error) {
        const body = CustomError.ofType("noSuchDocument");
        Controller.respondError(response, body);
      }
    });
  }

  @post(SERVER_PATHS["contact"])
  @before(checkUser(), verifyRecaptcha())
  public async [Symbol()](request: Request<"contact">, response: Response<"contact">): Promise<void> {
    const user = request.user;
    const name = request.body.name;
    const email = request.body.email;
    const subject = request.body.subject;
    const text = request.body.text;
    const signedIn = (user !== undefined).toString();
    const userName = user?.name ?? "";
    if (text !== "") {
      const administrator = await UserModel.fetchOneAdministrator();
      if (administrator !== null) {
        const nextSubject = MailUtil.getSubject("contact", {subject});
        const nextText = MailUtil.getText("contact", {userName, email, subject, text, signedIn, name});
        MailUtil.send(administrator.email, nextSubject, nextText);
        Controller.respond(response, null);
      } else {
        const body = CustomError.ofType("administratorNotFound");
        Controller.respondError(response, body);
      }
    } else {
      const body = CustomError.ofType("emptyContactText");
      Controller.respondError(response, body);
    }
  }

}