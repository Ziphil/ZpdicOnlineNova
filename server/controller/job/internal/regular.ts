//

import {Job} from "agenda";
import {JobController} from "/server/controller/job/controller";
import {job, jobController} from "/server/controller/job/decorator";
import {HistoryModel, WordModel} from "/server/model";
import {LogUtil} from "/server/util/log";


@jobController()
export class RegularJobController extends JobController {

  @job("discardOldHistoryWords")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/discardOldHistoryWords", {});
    await WordModel.discardOldHistory(90);
  }

  @job("addHistories")
  public async [Symbol()](job: Job<any>): Promise<void> {
    LogUtil.log("worker/addHistories", {});
    await HistoryModel.addAll();
  }

}