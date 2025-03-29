//

import {Request, Response} from "express";
import {before, post, restController} from "/server/controller/rest/decorator";
import {InternalRestController} from "/server/internal/controller/rest/base";
import {checkMe, parseMe} from "/server/internal/controller/rest/middleware";
import {ExampleOfferCreator} from "/server/internal/creator";
import {SERVER_PATH_PREFIX} from "/server/internal/type/rest";
import {ExampleOfferModel} from "/server/model";


@restController(SERVER_PATH_PREFIX)
export class DebugRestController extends InternalRestController {

  @post("/debug/addDailyExampleOffer")
  @before(parseMe(), checkMe("admin"))
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    const [keyword, example] = await ExampleOfferModel.addDaily();
    const body = [keyword, ExampleOfferCreator.skeletonize(example)];
    response.json(body).end();
  }

  @post("/debug/purgeAllJobs")
  @before(parseMe(), checkMe("admin"))
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    await this.agenda.purge();
    response.json({}).end();
  }

}