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
    try {
      const dictionary = await DictionaryModel.fetchOneByNumber(number);
      if (dictionary !== null) {
        const deserializer = createDeserializer(path, originalPath, dictionary);
        await dictionary.upload(deserializer);
        await fs.unlink(path).catch(() => null);
        job.attrs.data.status = "success";
        await job.save();
      } else {
        job.attrs.data.status = "error";
        job.attrs.data.errorCode = "noSuchDictionary";
        await job.save();
        throw new Error("noSuchDictionary");
      }
    } catch (error) {
      job.attrs.data.status = "error";
      job.attrs.data.errorCode = error.message;
      await job.save();
      throw error;
    }
  }

  @job("downloadDictionary")
  public async [Symbol()](job: Job<any>): Promise<void> {
    const {number, path} = job.attrs.data ?? {};
    LogUtil.log("worker/downloadDictionary", {number});
    try {
      const dictionary = await DictionaryModel.fetchOneByNumber(number);
      if (dictionary !== null) {
        const serializer = createSerializer(path, dictionary);
        await dictionary.download(serializer);
        job.attrs.data.status = "success";
        await job.save();
      } else {
        job.attrs.data.status = "error";
        job.attrs.data.errorCode = "noSuchDictionary";
        await job.save();
        throw new Error("noSuchDictionary");
      }
    } catch (error) {
      job.attrs.data.status = "error";
      await job.save();
      throw error;
    }
  }

}