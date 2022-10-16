//

import {
  ReactElement,
  ReactNode
} from "react";
import Badge from "/client/component/atom/badge";
import {
  create
} from "/client/component/create";
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

    const styleName = StyleNameUtil.create(
      "root",
      {if: forceWide, true: "force-wide"}
    );
    const badgeNode = (badgeValue) && (
      <Badge value={badgeValue}/>
    );
    const descriptionNode = (description) && (
      <p styleName="description">
        {description}
      </p>
    );
    const descriptionWrapperNode = (label || description) && (
      <div styleName="description-wrapper">
        <div styleName="label">
          {label}
          {badgeNode}
        </div>
        {descriptionNode}
      </div>
    );
    const node = (
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