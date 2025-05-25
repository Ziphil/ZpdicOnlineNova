//

import {before, post, restController} from "/server/controller/rest/decorator";
import {FilledMiddlewareBody, InternalRestController, Request, Response} from "/server/internal/controller/rest/base";
import {checkDictionary, checkMe, checkRecaptcha, parseDictionary} from "/server/internal/controller/rest/middleware";
import {ProposalCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {ProposalModel} from "/server/model";
import {QueryRange} from "/server/util/query";
import {mapWithSize} from "/server/util/with-size";


@restController(SERVER_PATH_PREFIX)
export class ProposalRestController extends InternalRestController {

  @post("/addProposal")
  @before(checkRecaptcha(), parseDictionary())
  public async [Symbol()](request: Request<"addProposal">, response: Response<"addProposal">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {name, comment} = request.body;
    if (name !== "") {
      const proposal = await ProposalModel.add(dictionary, name, comment);
      const body = ProposalCreator.skeletonize(proposal);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "emptyProposalName");
    }
  }

  @post("/discardProposal")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"discardProposal">, response: Response<"discardProposal">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {id} = request.body;
    const proposal = await ProposalModel.fetchOneByDictionaryAndId(dictionary, id);
    if (proposal) {
      await proposal.discard();
      const body = ProposalCreator.skeletonize(proposal);
      InternalRestController.respond(response, body);
    } else {
      InternalRestController.respondError(response, "noSuchProposal");
    }
  }

  @post("/fetchProposals")
  @before(checkMe(), checkDictionary("edit"))
  public async [Symbol()](request: Request<"fetchProposals">, response: Response<"fetchProposals">): Promise<void> {
    const {dictionary} = request.middlewareBody as FilledMiddlewareBody<"dictionary">;
    const {offset, size} = request.body;
    const range = new QueryRange(offset, size);
    const hitResult = await ProposalModel.fetchByDictionary(dictionary, range);
    const body = mapWithSize(hitResult, ProposalCreator.skeletonize);
    return InternalRestController.respond(response, body);
  }

}