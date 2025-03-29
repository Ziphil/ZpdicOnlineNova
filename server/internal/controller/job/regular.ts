//

import {Job} from "agenda";
import {JobController} from "/server/internal/controller/job/controller-base";
import {job, jobController, schedule} from "/server/internal/controller/job/decorator";
import {ArticleModel, ExampleModel, ExampleOfferModel, HistoryModel, WordModel} from "/server/model";
import {LogUtil} from "/server/util/log";


@jobController()
export class RegularJobController extends JobController {

  @job("discardOldHistoryWords")
  @schedule("0 3 * * *")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/discardOlds", {});
    await Promise.all([
      WordModel.discardOlds(90),
      ExampleModel.discardOlds(90),
      ArticleModel.discardOlds(90)
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