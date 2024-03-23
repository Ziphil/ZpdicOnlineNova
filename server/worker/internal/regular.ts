//

import {Job} from "agenda";
import {HistoryModel, WordModel} from "/server/model";
import {LogUtil} from "/server/util/log";
import {job, worker} from "/server/worker/decorator";
import {Worker} from "/server/worker/worker";


@worker()
export class RegularWorker extends Worker {

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