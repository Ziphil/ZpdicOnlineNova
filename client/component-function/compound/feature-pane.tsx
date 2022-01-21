//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";


const FeaturePane = create(
  require("./feature-pane.scss"), "FeaturePane",
  function ({
  }: {
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <div styleName="root">
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon">&#xF044;</div>
            <h1 styleName="head">{trans("featurePane.dictionary.title")}</h1>
          </div>
          <p styleName="text">{trans("featurePane.dictionary.text")}</p>
        </div>
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon">&#xF002;</div>
            <h1 styleName="head">{trans("featurePane.search.title")}</h1>
          </div>
          <p styleName="text">{trans("featurePane.search.text")}</p>
        </div>
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon">&#xF0C0;</div>
            <h1 styleName="head">{trans("featurePane.user.title")}</h1>
          </div>
          <p styleName="text">{trans("featurePane.user.text")}</p>
        </div>
      </div>
    );
    return node;

  }
);


export default FeaturePane;