//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";


export const DictionaryPage = create(
  require("./dictionary-page.scss"), "DictionaryPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <Page {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
          </div>
          <div styleName="right">
          </div>
        </MainContainer>
      </Page>
    );

  }
);