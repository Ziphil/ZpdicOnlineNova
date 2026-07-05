//

import {Job} from "agenda";
import {JobController} from "/server/controller/job/controller";
import {job, jobController, schedule} from "/server/controller/job/decorator";
import {ExampleOfferModel, HistoryModel, OldArticleModel, OldExampleModel, OldWordModel} from "/server/model";
import {LogUtil} from "/server/util/log";


@jobController()
export class RegularJobController extends JobController {

  @job("discardOldHistoryWords")
  @schedule("0 3 * * *")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/discardOlds", {});
    await Promise.all([
      OldWordModel.discardOlds(90),
      OldExampleModel.discardOlds(90),
      OldArticleModel.discardOlds(90)
    ]);
  }

  @job("addHistories")
  @schedule("30 23 * * *")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/addHistories", {});
    await HistoryModel.addAll();
  }

  @job("addDailyExampleOffer")
  @schedule("0 6 * * *")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/addDailyExampleOffer", {});
    await ExampleOfferModel.addDaily();
  }

}