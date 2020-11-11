//

import {
  CustomError
} from "/client/skeleton/error";
import {
  Controller,
  Request,
  Response
} from "/server/controller/controller";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/interface/type";
import {
  verifyDictionary,
  verifyUser
} from "/server/controller/middle";
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
    let dictionary = request.dictionary;
    let type = request.body.type;
    let userName = request.body.userName;
    let user = await UserModel.fetchOneByName(userName);
    if (dictionary && user) {
      try {
        let invitation = await InvitationModel.add(type, dictionary, user);
        let body = await InvitationCreator.create(invitation);
        Controller.respond(response, body);
      } catch (error) {
        let body = (() => {
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
      let body = (() => {
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
    let user = request.user!;
    let id = request.body.id;
    let accept = request.body.accept;
    let invitation = await InvitationModel.findById(id);
    if (invitation) {
      try {
        invitation.respond(user, accept);
        let body = await InvitationCreator.create(invitation);
        Controller.respond(response, body);
      } catch (error) {
        if (error.name === "CustomError" && error.type === "forbidden") {
          Controller.respondForbidden(response);
        } else {
          throw error;
        }
      }
    } else {
      let body = CustomError.ofType("noSuchInvitation");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["fetchInvitations"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchInvitations">, response: Response<"fetchInvitations">): Promise<void> {
    let user = request.user!;
    let type = request.body.type;
    let invitations = await InvitationModel.fetchByUser(type, user);
    let body = await Promise.all(invitations.map((invitation) => InvitationCreator.create(invitation)));
    Controller.respond(response, body);
  }

}