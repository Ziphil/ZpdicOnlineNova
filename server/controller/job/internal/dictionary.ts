//

import {Job} from "agenda";
import fs from "fs/promises";
import {JobController} from "/server/controller/job/controller";
import {job, jobController} from "/server/controller/job/decorator";
import {DictionaryModel, createDeserializer, createSerializer} from "/server/model";
import {LogUtil} from "/server/util/log";


@jobController()
export class DictionaryJobController extends JobController {

  @job("uploadDictionary")
  public async [Symbol()](job: Job<any>): Promise<void> {
    const {number, path, originalPath} = job.attrs.data ?? {};
    LogUtil.log("worker/uploadDictionary", {number});
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary !== null) {
      const deserializer = createDeserializer(path, originalPath, dictionary);
      await dictionary.upload(deserializer);
      await fs.unlink(path).catch(() => null);
    }
  }

  @job("downloadDictionary")
  public async [Symbol()](job: Job<any>): Promise<void> {
    const {number, path} = job.attrs.data ?? {};
    LogUtil.log("worker/downloadDictionary", {number});
    const dictionary = await DictionaryModel.fetchOneByNumber(number);
    if (dictionary !== null) {
      const serializer = createSerializer(path, dictionary);
      if (serializer !== null) {
        await dictionary.download(serializer);
      }
    }
  }

}