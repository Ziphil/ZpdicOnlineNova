//

import * as react from "react";
import {
  MouseEvent,
  ReactElement
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  StyleNameUtil
} from "/client/util/style-name";


const InformationPane = create(
  require("./information-pane.scss"), "InformationPane",
  function ({
    texts,
    style,
    onClose
  }: {
    texts: Array<string>,
    style: "error" | "information",
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void
  }): ReactElement {

    let styleName = StyleNameUtil.create("root", style);
    let itemNodes = texts.map((text, index) => {
      let itemNode = <li key={index}>{text}</li>;
      return itemNode;
    });
    let node = (
      <div styleName={styleName}>
        <ul styleName="list">
          {itemNodes}
        </ul>
        <div styleName="button-box"/>
        <div styleName="overlay"/>
        <div styleName="button">
          <Button iconName="times" style="simple" onClick={onClose}/>
        </div>
      </div>
    );
    return node;

  }
);


export default InformationPane;