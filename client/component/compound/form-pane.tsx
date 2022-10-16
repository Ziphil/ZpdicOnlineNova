//

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
    errorScheme = "red",
    onErrorClose,
    children
  }: {
    errorType?: string | null,
    errorScheme?: "red" | "blue",
    onErrorClose?: (event: MouseEvent<HTMLButtonElement>) => void,
    children?: ReactNode
  }): ReactElement {

    const [intl] = useIntl();

    const node = (
      <div>
        {(errorType !== null) && (
          <div styleName="error">
            <InformationPane texts={[PopupUtil.getMessage(intl, errorType ?? "")]} scheme={errorScheme} onClose={onErrorClose}/>
          </div>
        )}
        <div styleName="root">
          {children}
        </div>
      </div>
    );
    return node;

  }
);


export default FormPane;