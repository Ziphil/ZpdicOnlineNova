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
  DataUtil
} from "/client/util/data";


export const InformationPane = create(
  require("./information-pane.scss"), "InformationPane",
  function ({
    texts,
    scheme,
    onClose
  }: {
    texts: Array<string>,
    scheme: "red" | "blue",
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void
  }): ReactElement {

    const data = DataUtil.create({scheme});
    const node = (
      <div styleName="root" {...data}>
        <ul styleName="list">
          {texts.map((text, index) => <li key={index}>{text}</li>)}
        </ul>
        <div styleName="button-box"/>
        <div styleName="overlay"/>
        <div styleName="button">
          <Button iconName="times" variant="simple" onClick={onClose}/>
        </div>
      </div>
    );
    return node;

  }
);


export default InformationPane;