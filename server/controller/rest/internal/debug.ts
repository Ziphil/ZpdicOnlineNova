//

import {Request, Response} from "express";
import {before, post, restController} from "/server/controller/rest/decorator";
import {InternalRestController} from "/server/controller/rest/internal/controller";
import {checkMe, parseMe} from "/server/controller/rest/internal/middleware";
import {ExampleOfferCreator} from "/server/creator";
import {ExampleOfferModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";


@restController(SERVER_PATH_PREFIX)
export class DebugRestController extends InternalRestController {

  @post("/debug/addDailyExampleOffer")
  @before(parseMe(), checkMe("admin"))
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    const example = await ExampleOfferModel.addDaily();
    const body = ExampleOfferCreator.create(example);
    response.json(body).end();
  }

  @post("/debug/purgeAllJobs")
  @before(parseMe(), checkMe("admin"))
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    await this.agenda.purge();
    response.json({}).end();
  }

}