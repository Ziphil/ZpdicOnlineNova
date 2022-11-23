//

import {
  ReactElement
} from "react";
import Icon from "/client/component/atom/icon";
import {
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";


const FeaturePane = create(
  require("./feature-pane.scss"), "FeaturePane",
  function ({
  }: {
  }): ReactElement {

    const {trans} = useTrans("featurePane");

    const node = (
      <div styleName="root">
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon"><Icon name="edit"/></div>
            <h1 styleName="head">{trans("dictionary.title")}</h1>
          </div>
          <p styleName="text">{trans("dictionary.text")}</p>
        </div>
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon"><Icon name="search"/></div>
            <h1 styleName="head">{trans("search.title")}</h1>
          </div>
          <p styleName="text">{trans("search.text")}</p>
        </div>
        <div styleName="item">
          <div styleName="head-wrapper">
            <div styleName="icon"><Icon name="users"/></div>
            <h1 styleName="head">{trans("user.title")}</h1>
          </div>
          <p styleName="text">{trans("user.text")}</p>
        </div>
      </div>
    );
    return node;

  }
);


export default FeaturePane;