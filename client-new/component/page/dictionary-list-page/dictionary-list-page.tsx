//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {SearchDictionaryForm} from "/client-new/component/compound/search-dictionary-form";
import {create} from "/client-new/component/create";


export const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryListPage");

    return (
      <Page {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <SearchDictionaryForm/>
          </div>
          <div styleName="right">

          </div>
        </MainContainer>
      </Page>
    );

  }
);
