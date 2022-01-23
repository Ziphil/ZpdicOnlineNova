//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import Badge from "/client/component-function/atom/badge";
import {
  create
} from "/client/component-function/create";
import {
  StyleNameUtil
} from "/client/util/style-name";


const SettingPane = create(
  require("./setting-pane.scss"), "SettingPane",
  function ({
    label,
    badgeValue,
    description,
    forceWide = false,
    children
  }: {
    label?: string,
    badgeValue?: string | number,
    description?: ReactNode,
    forceWide?: boolean,
    children?: ReactNode
  }): ReactElement {

    let styleName = StyleNameUtil.create([
      "root",
      {if: forceWide, true: "force-wide"}
    ]);
    let badgeNode = (badgeValue) && (
      <Badge value={badgeValue}/>
    );
    let descriptionNode = (description) && (
      <p styleName="description">
        {description}
      </p>
    );
    let descriptionWrapperNode = (label || description) && (
      <div styleName="description-wrapper">
        <div styleName="label">
          {label}
          {badgeNode}
        </div>
        {descriptionNode}
      </div>
    );
    let node = (
      <div styleName={styleName}>
        {descriptionWrapperNode}
        <div styleName="content">
          {children}
        </div>
      </div>
    );
    return node;

  }
);


export default SettingPane;