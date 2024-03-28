//

import {Request, Response} from "express";
import {before, post, restController} from "/server/controller/rest/decorator";
import {InternalRestController} from "/server/controller/rest/internal/controller";
import {checkMe, parseMe} from "/server/controller/rest/internal/middleware";
import {OfferedExampleCreator} from "/server/creator/example/offered-example";
import {OfferedExampleModel} from "/server/model";
import {SERVER_PATH_PREFIX} from "/server/type/rest/internal";


@restController(SERVER_PATH_PREFIX)
export class DebugRestController extends InternalRestController {

  @post("/debug/addDailyOfferedExample")
  @before(parseMe(), checkMe("admin"))
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    const example = await OfferedExampleModel.addDaily();
    const body = OfferedExampleCreator.create(example);
    response.json(body).end();
  }

}