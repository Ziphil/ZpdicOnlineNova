//

import {Job} from "agenda";
import {JobController} from "/server/controller/job/controller";
import {job, jobController, schedule} from "/server/controller/job/decorator";
import {HistoryModel, WordModel} from "/server/model";
import {LogUtil} from "/server/util/log";


@jobController()
export class RegularJobController extends JobController {

  @job("discardOldHistoryWords")
  @schedule("0 3 * * *")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/discardOldHistoryWords", {});
    await WordModel.discardOldHistory(90);
  }

  @job("addHistories")
  @schedule("30 23 * * *")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/addHistories", {});
    await HistoryModel.addAll();
  }

}