//

import {
  Request,
  Response
} from "express";
import {
  createElement
} from "react";
import {
  renderToString
} from "react-dom/server";
import {
  DocumentPage
} from "/client/component/page/document-page";
import {
  Controller
} from "/server/controller/controller";
import {
  controller,
  get,
  post
} from "/server/controller/decorator";


@controller("/")
export class DocumentController extends Controller {

  @get("/document/debug")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    let component = renderToString(createElement(DocumentPage));
    let html = `<html>${component}</html>`;
    response.send(html);
  }

}