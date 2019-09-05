//

import {
  Router
} from "express";


export abstract class BaseController {

  public router: Router;

  public constructor() {
    this.router = Router();
    this.setup();
  }

  protected abstract setup(): void;

}