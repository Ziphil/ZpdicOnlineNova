//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {DownloadDictionaryForm} from "/client/component/form/download-dictionary-form";


export const DownloadDictionaryPage = create(
  require("./download-dictionary-page.scss"), "DownloadDictionaryPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {id} = useParams();

    return (
      <Page styleName="root" headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main">
          <DownloadDictionaryForm id={id ?? ""}/>
        </MainContainer>
      </Page>
    );

  }
);
