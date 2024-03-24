//

import {before, post, restController} from "/server/controller/rest/decorator";
import {InternalRestController, Request, Response} from "/server/controller/rest/internal/controller";
import {checkRecaptcha, parseMe} from "/server/controller/rest/internal/middleware";
import {UserModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";
import {MailUtil} from "/server/util/mail";


@restController(SERVER_PATH_PREFIX)
export class OtherRestController extends InternalRestController {

  @post("/fetchDocument")
  public async [Symbol()](request: Request<"fetchDocument">, response: Response<"fetchDocument">): Promise<void> {
    const {locale, path} = request.body;
    const localPath = `/dist/document/${locale}/${path || "index"}.md`;
    response.sendFile(process.cwd() + localPath, (error) => {
      if (error) {
        InternalRestController.respondError(response, "noSuchDocument");
      }
    });
  }

  @post("/contact")
  @before(checkRecaptcha(), parseMe())
  public async [Symbol()](request: Request<"contact">, response: Response<"contact">): Promise<void> {
    const {me} = request.middlewareBody;
    const {name, email, subject, text} = request.body;
    const signedIn = (me !== null).toString();
    const userName = me?.name ?? "";
    if (text !== "") {
      const administrator = await UserModel.fetchOneAdministrator();
      if (administrator !== null) {
        const nextSubject = MailUtil.getSubject("contact", {subject});
        const nextText = MailUtil.getText("contact", {userName, email, subject, text, signedIn, name});
        MailUtil.send(administrator.email, nextSubject, nextText);
        InternalRestController.respond(response, null);
      } else {
        InternalRestController.respondError(response, "administratorNotFound");
      }
    } else {
      InternalRestController.respondError(response, "emptyContactText");
    }
  }

}