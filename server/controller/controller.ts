//

import Agenda from "agenda";
import {Express, Router} from "express";


export class Controller {

  protected application: Express;
  protected agenda: Agenda;
  protected router: Router;
  protected path: string;

  public constructor(application: Express, agenda: Agenda) {
    this.application = application;
    this.agenda = agenda;
    this.router = Router();
    this.path = "/";
  }

  protected setup(): void {
  }

  /** このクラスを継承したクラスのインスタンスを生成し、引数として渡されたアプリケーションオブジェクトに対してルーターの設定を行います。
   * このときに生成したインスタンスを返します。*/
  public static use<C extends Controller>(this: new(application: Express, agenda: Agenda) => C, application: Express, agenda: Agenda): C {
    const controller = new this(application, agenda);
    controller.setup();
    application.use(controller.path, controller.router);
    return controller;
  }

}