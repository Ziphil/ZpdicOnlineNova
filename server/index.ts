//

import sendgrid from "@sendgrid/mail";
import * as typegoose from "@typegoose/typegoose";
import aws from "aws-sdk";
import cookieParser from "cookie-parser";
import express from "express";
import {
  Express,
  NextFunction,
  Request,
  Response
} from "express";
import fs from "fs";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import {
  CommissionController,
  DebugController,
  DictionaryController,
  ExampleController,
  HistoryController,
  InvitationController,
  NotificationController,
  OtherController,
  ResourceController,
  UserController,
  WordController
} from "/server/controller/internal";
import {
  DictionaryModel
} from "/server/model/dictionary";
import {
  LogUtil
} from "/server/util/log";
import {
  MongoUtil
} from "/server/util/mongo";
import {
  AWS_KEY,
  AWS_REGION,
  AWS_SECRET,
  COOKIE_SECRET,
  MONGO_URI,
  PORT,
  SENDGRID_KEY
} from "/server/variable";
import {
  agenda
} from "/worker/agenda";


export class Main {

  private application!: Express;

  public main(): void {
    this.application = express();
    this.setupBodyParsers();
    this.setupCookie();
    this.setupMulter();
    this.setupMorgan();
    this.setupMongo();
    this.setupSendgrid();
    this.setupAws();
    this.setupDirectories();
    this.setupRouters();
    this.setupWorkers();
    this.setupSchedules();
    this.setupStatic();
    this.setupFallbackHandlers();
    this.setupErrorHandler();
    this.listen();
  }

  // リクエストボディをパースするミドルウェアの設定をします。
  private setupBodyParsers(): void {
    const urlencodedParser = express.urlencoded({extended: false});
    const jsonParser = express.json();
    this.application.use(urlencodedParser);
    this.application.use(jsonParser);
  }

  private setupCookie(): void {
    const middleware = cookieParser(COOKIE_SECRET);
    this.application.use(middleware);
  }

  // ファイルをアップロードする処理を行う Multer の設定をします。
  // アップロードされたファイルは upload フォルダ内に保存するようにしています。
  private setupMulter(): void {
    const middleware = multer({dest: "./dist/upload/"}).single("file");
    this.application.use("/internal*", middleware);
  }

  // アクセスログを出力する morgan の設定をします。
  private setupMorgan(): void {
    const middleware = morgan<Request>((tokens, request, response) => {
      const method = tokens.method(request, response);
      const status = +tokens.status(request, response)!;
      const url = tokens.url(request, response);
      const time = +tokens["total-time"](request, response, 0)!;
      const body = ("password" in request.body) ? {...request.body, password: "***"} : request.body;
      const logString = JSON.stringify({url, method, status, time, body});
      return `!<request> ${logString}`;
    });
    this.application.use(middleware);
  }

  // MongoDB との接続を扱う mongoose とそのモデルを自動で生成する typegoose の設定を行います。
  // typegoose のデフォルトでは、空文字列を入れると値が存在しないと解釈されてしまうので、空文字列も受け入れるようにしています。
  private setupMongo(): void {
    MongoUtil.setCheckRequired("String");
    mongoose.connect(MONGO_URI);
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  private setupSendgrid(): void {
    sendgrid.setApiKey(SENDGRID_KEY);
  }

  private setupAws(): void {
    const credentials = {accessKeyId: AWS_KEY, secretAccessKey: AWS_SECRET};
    const region = AWS_REGION;
    aws.config.update({credentials, region});
  }

  // 内部処理で用いるディレクトリを用意します。
  private setupDirectories(): void {
    fs.mkdirSync("./dist/download", {recursive: true});
  }

  // ルーターの設定を行います。
  // このメソッドは、各種ミドルウェアの設定メソッドを全て呼んだ後に実行してください。
  private setupRouters(): void {
    CommissionController.use(this.application);
    DebugController.use(this.application);
    DictionaryController.use(this.application);
    ExampleController.use(this.application);
    HistoryController.use(this.application);
    InvitationController.use(this.application);
    NotificationController.use(this.application);
    OtherController.use(this.application);
    ResourceController.use(this.application);
    UserController.use(this.application);
    WordController.use(this.application);
  }

  private setupWorkers(): void {
    agenda.define("uploadDictionary", async (job, done) => {
      LogUtil.log("worker/uploadDictionary", job.attrs.data);
      const {number, path, originalPath} = job.attrs.data ?? {};
      try {
        const dictionary = await DictionaryModel.fetchOneByNumber(number);
        if (dictionary !== null) {
          await dictionary.upload(path, originalPath);
          await fs.promises.unlink(path);
        }
      } catch (error) {
        LogUtil.error("worker/uploadDictionary", null, error);
        throw error;
      }
    });
    agenda.define("addHistories", async (job, done) => {
      LogUtil.log("worker/addHistories", job.attrs.data);
      await HistoryController.addHistories();
    });
  }

  private setupSchedules(): void {
    agenda.every("30 23 * * *", "addHistories", {}, {timezone: "Asia/Tokyo"});
  }

  private setupStatic(): void {
    this.application.use("/client", express.static(process.cwd() + "/dist/client"));
    this.application.use("/static", express.static(process.cwd() + "/dist/static"));
  }

  // ルーターで設定されていない URL にアクセスされたときのフォールバックの設定をします。
  // フロントエンドから呼び出すためのエンドポイント用 URL で処理が存在しないものにアクセスされた場合は、404 エラーを返します。
  // そうでない場合は、フロントエンドのトップページを返します。
  private setupFallbackHandlers(): void {
    const internalHandler = function (request: Request, response: Response, next: NextFunction): void {
      const fullUrl = request.protocol + "://" + request.get("host") + request.originalUrl;
      response.status(404).end();
    };
    const otherHandler = function (request: Request, response: Response, next: NextFunction): void {
      const method = request.method;
      if ((method === "GET" || method === "HEAD") && request.accepts("html")) {
        response.sendFile(process.cwd() + "/dist/client/index.html", (error) => {
          if (error) {
            next(error);
          }
        });
      } else {
        next();
      }
    };
    this.application.use("/internal*", internalHandler);
    this.application.use("*", otherHandler);
  }

  private setupErrorHandler(): void {
    const handler = function (error: any, request: Request, response: Response, next: NextFunction): void {
      LogUtil.error("server", null, error);
      response.status(500).end();
    };
    this.application.use(handler);
  }

  private listen(): void {
    this.application.listen(+PORT, () => {
      LogUtil.log("server", {port: +PORT});
    });
  }

}


const main = new Main();
main.main();