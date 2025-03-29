//

import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/controller";
import {before, post, restController} from "/server/internal/controller/rest/decorator";
import {checkDictionary, checkMe} from "/server/internal/controller/rest/middleware";
import {InvitationCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {CustomError, InvitationModel, UserModel} from "/server/model";


@restController(SERVER_PATH_PREFIX)
export class InvitationRestController extends InternalRestController {

  @post("/addInvitation")
  @before(checkMe(), checkDictionary("own"))
  public async [Symbol()](request: Request<"addInvitation">, response: Response<"addInvitation">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"me" | "dictionary">;
    const {type, userName} = request.body;
    const user = await UserModel.fetchOneByName(userName);
    if (user) {
      try {
        const invitation = await InvitationModel.add(type, dictionary, user);
        const body = await InvitationCreator.skeletonize(invitation);
        InternalRestController.respond(response, body);
      } catch (error) {
        InternalRestController.respondByCustomError(response, ["userCanAlreadyEdit", "userCanAlreadyOwn", "editInvitationAlreadyAdded", "transferInvitationAlreadyAdded"], error);
      }
    } else {
      InternalRestController.respondError(response, "noSuchUser");
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
        const body = await InvitationCreator.skeletonize(invitation);
        InternalRestController.respond(response, body);
      } catch (error) {
        if (CustomError.isCustomError(error) && error.type === "forbidden") {
          InternalRestController.respondForbiddenError(response);
        } else {
          throw error;
        }
      }
    } else {
      InternalRestController.respondError(response, "noSuchInvitation");
    }
  }

  @post("/fetchInvitations")
  @before(checkMe())
  public async [Symbol()](request: Request<"fetchInvitations">, response: Response<"fetchInvitations">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {type} = request.body;
    const invitations = await InvitationModel.fetchByUser(type, me);
    const body = await Promise.all(invitations.map(InvitationCreator.skeletonize));
    InternalRestController.respond(response, body);
  }

}