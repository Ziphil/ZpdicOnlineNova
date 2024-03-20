//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, FilledMiddlewareBody, Request, Response} from "/server/controller/internal/controller";
import {checkDictionary, checkMe} from "/server/controller/internal/middleware";
import {InvitationCreator} from "/server/creator";
import {CustomError, InvitationModel, UserModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class InvitationController extends Controller {

  @post("/addInvitation")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"addInvitation">, response: Response<"addInvitation">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {type, userName} = request.body;
    const user = await UserModel.fetchOneByName(userName);
    if (user) {
      try {
        const invitation = await InvitationModel.add(type, dictionary, user);
        const body = await InvitationCreator.create(invitation);
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondByCustomError(response, ["userCanAlreadyEdit", "userCanAlreadyOwn", "editInvitationAlreadyAdded", "transferInvitationAlreadyAdded"], error);
      }
    } else {
      Controller.respondError(response, "noSuchUser");
    }
  }

  @post("/respondInvitation")
  @before(checkMe())
  public async [Symbol()](request: Request<"respondInvitation">, response: Response<"respondInvitation">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {id, accept} = request.body;
    const invitation = await InvitationModel.findById(id);
    if (invitation) {
      try {
        await invitation.respond(me, accept);
        const body = await InvitationCreator.create(invitation);
        Controller.respond(response, body);
      } catch (error) {
        if (CustomError.isCustomError(error) && error.type === "forbidden") {
          Controller.respondForbiddenError(response);
        } else {
          throw error;
        }
      }
    } else {
      Controller.respondError(response, "noSuchInvitation");
    }
  }

  @post("/fetchInvitations")
  @before(checkMe())
  public async [Symbol()](request: Request<"fetchInvitations">, response: Response<"fetchInvitations">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {type} = request.body;
    const invitations = await InvitationModel.fetchByUser(type, me);
    const body = await Promise.all(invitations.map(InvitationCreator.create));
    Controller.respond(response, body);
  }

}