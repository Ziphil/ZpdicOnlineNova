//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./error-page.scss"))
export default class ErrorPage extends Component<Props, State> {

  private getMessage(): string {
    let error = this.props.error;
    if (error instanceof Error) {
      let message = error.message + "\n" + error.stack;
      return message;
    } else {
      return error.toString();
    }
  }

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="root">
          <div styleName="description">
            {this.trans("errorPage.description")}
          </div>
          <pre styleName="message">
            {this.getMessage()}
          </pre>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
  error: any
};
type State = {
};