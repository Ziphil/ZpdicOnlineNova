//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode
} from "react";
import InformationPane from "/client/component/compound/information-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
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

    const [intl] = useIntl();

    const texts = [PopupUtil.getMessage(intl, errorType ?? "")];
    const errorNode = (errorType !== null) && (
      <div styleName="error">
        <InformationPane texts={texts} style={errorStyle} onClose={onErrorClose}/>
      </div>
    );
    const node = (
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