//

import {
  MouseEvent,
  ReactElement
} from "react";
import Button from "/client/component/atom/button";
import {
  create
} from "/client/component/create";
import {
  data
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

    const node = (
      <div styleName="root" {...data({scheme})}>
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