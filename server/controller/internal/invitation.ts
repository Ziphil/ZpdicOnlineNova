//

import {before, controller, post} from "/server/controller/decorator";
import {Controller, Request, Response} from "/server/controller/internal/controller";
import {verifyDictionary, verifyMe} from "/server/controller/internal/middle-old";
import {InvitationCreator} from "/server/creator";
import {CustomError, InvitationModel, UserModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/internal";


@controller(SERVER_PATH_PREFIX)
export class InvitationController extends Controller {

  @post("/addInvitation")
  @before(verifyMe(), verifyDictionary("own"))
  public async [Symbol()](request: Request<"addInvitation">, response: Response<"addInvitation">): Promise<void> {
    const dictionary = request.dictionary;
    const {type, userName} = request.body;
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
        Controller.respondError(response, "noSuchDictionary");
      } else {
        Controller.respondError(response, "noSuchUser");
      }
    }
  }

  @post("/respondInvitation")
  @before(verifyMe())
  public async [Symbol()](request: Request<"respondInvitation">, response: Response<"respondInvitation">): Promise<void> {
    const me = request.me!;
    const {id, accept} = request.body;
    const invitation = await InvitationModel.findById(id);
    if (invitation) {
      try {
        invitation.respond(me, accept);
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
  @before(verifyMe())
  public async [Symbol()](request: Request<"fetchInvitations">, response: Response<"fetchInvitations">): Promise<void> {
    const me = request.me!;
    const {type} = request.body;
    const invitations = await InvitationModel.fetchByUser(type, me);
    const body = await Promise.all(invitations.map((invitation) => InvitationCreator.create(invitation)));
    Controller.respond(response, body);
  }

}