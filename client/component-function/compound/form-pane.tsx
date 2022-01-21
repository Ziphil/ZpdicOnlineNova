//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode
} from "react";
import InformationPane from "/client/component-function/compound/information-pane";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import {
  PopupUtil
} from "/client/util/popup";


const FormPane = create(
  require("./form-pane.scss"), "FormPane",
  function ({
    errorType = null,
    errorStyle = "error",
    onErrorClose,
    children
  }: {
    errorType?: string | null,
    errorStyle?: "error" | "information",
    onErrorClose?: (event: MouseEvent<HTMLButtonElement>) => void,
    children?: ReactNode
  }): ReactElement {

    let [intl] = useIntl();

    let texts = [PopupUtil.getMessage(intl, errorType ?? "")];
    let errorNode = (errorType !== null) && (
      <div styleName="error">
        <InformationPane texts={texts} style={errorStyle} onClose={onErrorClose}/>
      </div>
    );
    let node = (
      <div>
        {errorNode}
        <div styleName="root">
          {children}
        </div>
      </div>
    );
    return node;

  }
);


export default FormPane;