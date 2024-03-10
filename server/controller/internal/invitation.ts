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
  verifyDictionary,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  InvitationCreator,
  InvitationModel
} from "/server/model/invitation";
import {
  UserModel
} from "/server/model/user";


@controller(SERVER_PATH_PREFIX)
export class InvitationController extends Controller {

  @post(SERVER_PATHS["addInvitation"])
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
        const body = (() => {
          if (error.name === "CustomError") {
            if (error.type === "userCanAlreadyEdit") {
              return CustomError.ofType("userCanAlreadyEdit");
            } else if (error.type === "userCanAlreadyOwn") {
              return CustomError.ofType("userCanAlreadyOwn");
            } else if (error.type === "editInvitationAlreadyAdded") {
              return CustomError.ofType("editInvitationAlreadyAdded");
            } else if (error.type === "transferInvitationAlreadyAdded") {
              return CustomError.ofType("transferInvitationAlreadyAdded");
            }
          }
        })();
        Controller.respondError(response, body, error);
      }
    } else {
      const body = (() => {
        if (dictionary === undefined) {
          return CustomError.ofType("noSuchDictionaryNumber");
        } else {
          return CustomError.ofType("noSuchUser");
        }
      })();
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["respondInvitation"])
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
        if (error.name === "CustomError" && error.type === "forbidden") {
          Controller.respondForbidden(response);
        } else {
          throw error;
        }
      }
    } else {
      const body = CustomError.ofType("noSuchInvitation");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchInvitations"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchInvitations">, response: Response<"fetchInvitations">): Promise<void> {
    const user = request.user!;
    const type = request.body.type;
    const invitations = await InvitationModel.fetchByUser(type, user);
    const body = await Promise.all(invitations.map((invitation) => InvitationCreator.create(invitation)));
    Controller.respond(response, body);
  }

}