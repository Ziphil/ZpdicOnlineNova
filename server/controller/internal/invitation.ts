//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyUser} from "/server/controller/internal/middle";
import {InvitationCreator} from "/server/creator";
import {CustomError, InvitationModel, UserModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class InvitationController extends Controller {

  @post("/addInvitation")
  @before(verifyUser(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"addInvitation">, response: Response<"addInvitation">): Promise<void> {
    const dictionary = request.dictionary;
    const type = request.body.type;
    const userName = request.body.userName;
    const user = await UserModel.fetchOneByName(userName);
    if (dictionary && user) {
      try {
        const invitation = await InvitationModel.add(type, dictionary, user);
        const body = await InvitationCreator.create(invitation);
        Controller.respond(response, body);
      } catch (error) {
        Controller.respondByCustomError(response, ["userCanAlreadyEdit", "userCanAlreadyOwn", "editInvitationAlreadyAdded", "transferInvitationAlreadyAdded"], error);
      }
    } else {
      if (dictionary === undefined) {
        Controller.respondError(response, "noSuchDictionaryNumber");
      } else {
        Controller.respondError(response, "noSuchUser");
      }
    }
  }

  @post("/respondInvitation")
  @before(verifyUser())
  public async [Symbol()](request: Request<"respondInvitation">, response: Response<"respondInvitation">): Promise<void> {
    const user = request.user!;
    const id = request.body.id;
    const accept = request.body.accept;
    const invitation = await InvitationModel.findById(id);
    if (invitation) {
      try {
        invitation.respond(user, accept);
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
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchInvitations">, response: Response<"fetchInvitations">): Promise<void> {
    const user = request.user!;
    const type = request.body.type;
    const invitations = await InvitationModel.fetchByUser(type, user);
    const body = await Promise.all(invitations.map((invitation) => InvitationCreator.create(invitation)));
    Controller.respond(response, body);
  }

}