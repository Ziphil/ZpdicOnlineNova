//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./feature-pane.scss"))
export default class FeaturePane extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon">&#xF044;</div>
            <h1 styleName="head">{this.trans("featurePane.dictionary.title")}</h1>
          </div>
          <p styleName="text">{this.trans("featurePane.dictionary.text")}</p>
        </div>
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon">&#xF002;</div>
            <h1 styleName="head">{this.trans("featurePane.search.title")}</h1>
          </div>
          <p styleName="text">{this.trans("featurePane.search.text")}</p>
        </div>
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon">&#xF0C0;</div>
            <h1 styleName="head">{this.trans("featurePane.user.title")}</h1>
          </div>
          <p styleName="text">{this.trans("featurePane.user.text")}</p>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};