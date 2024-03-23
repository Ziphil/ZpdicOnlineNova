//

import {Job} from "agenda";
import fs from "fs/promises";
import {DictionaryModel} from "/server/model";
import {LogUtil} from "/server/util/log";
import {job, worker} from "/server/worker/decorator";
import {Worker} from "/server/worker/worker";


@worker()
export class DictionaryWorker extends Worker {

  @job("uploadDictionary")
  public async [Symbol()](job: Job<any>): Promise<void> {
    const {number, path, originalPath} = job.attrs.data ?? {};
    LogUtil.log("worker/uploadDictionary", {number});
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary !== null) {
      await dictionary.upload(path, originalPath);
      await fs.unlink(path);
    }
  }

}