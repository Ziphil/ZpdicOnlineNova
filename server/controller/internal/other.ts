//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {checkMe, verifyRecaptcha} from "/server/controller/internal/middle";
import {UserModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";
import {MailUtil} from "/server/util/mail";


@controller(SERVER_PATH_PREFIX)
export class OtherController extends Controller {

  @post("/fetchDocument")
  public async [Symbol()](request: Request<"fetchDocument">, response: Response<"fetchDocument">): Promise<void> {
    const {locale, path} = request.body;
    const localPath = `/dist/document/${locale}/${path || "index"}.md`;
    response.sendFile(process.cwd() + localPath, (error) => {
      if (error) {
        Controller.respondError(response, "noSuchDocument");
      }
    });
  }

  @post("/contact")
  @before(checkMe(), verifyRecaptcha())
  public async [Symbol()](request: Request<"contact">, response: Response<"contact">): Promise<void> {
    const me = request.me;
    const {name, email, subject, text} = request.body;
    const signedIn = (me !== undefined).toString();
    const userName = me?.name ?? "";
    if (text !== "") {
      const administrator = await UserModel.fetchOneAdministrator();
      if (administrator !== null) {
        const nextSubject = MailUtil.getSubject("contact", {subject});
        const nextText = MailUtil.getText("contact", {userName, email, subject, text, signedIn, name});
        MailUtil.send(administrator.email, nextSubject, nextText);
        Controller.respond(response, null);
      } else {
        Controller.respondError(response, "administratorNotFound");
      }
    } else {
      Controller.respondError(response, "emptyContactText");
    }
  }

}