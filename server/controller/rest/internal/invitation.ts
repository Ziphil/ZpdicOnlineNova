//

import {before, controller, post} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, Request, Response, RestController} from "/server/controller/rest/internal/controller";
import {checkDictionary, checkMe} from "/server/controller/rest/internal/middleware";
import {InvitationCreator} from "/server/creator";
import {CustomError, InvitationModel, UserModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class InvitationRestController extends RestController {

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
        RestController.respond(response, body);
      } catch (error) {
        RestController.respondByCustomError(response, ["userCanAlreadyEdit", "userCanAlreadyOwn", "editInvitationAlreadyAdded", "transferInvitationAlreadyAdded"], error);
      }
    } else {
      RestController.respondError(response, "noSuchUser");
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
        RestController.respond(response, body);
      } catch (error) {
        if (CustomError.isCustomError(error) && error.type === "forbidden") {
          RestController.respondForbiddenError(response);
        } else {
          throw error;
        }
      }
    } else {
      RestController.respondError(response, "noSuchInvitation");
    }
  }

  @post("/fetchInvitations")
  @before(checkMe())
  public async [Symbol()](request: Request<"fetchInvitations">, response: Response<"fetchInvitations">): Promise<void> {
    const {me} = request.middlewareBody as FilledMiddlewareBody<"me">;
    const {type} = request.body;
    const invitations = await InvitationModel.fetchByUser(type, me);
    const body = await Promise.all(invitations.map(InvitationCreator.create));
    RestController.respond(response, body);
  }

}