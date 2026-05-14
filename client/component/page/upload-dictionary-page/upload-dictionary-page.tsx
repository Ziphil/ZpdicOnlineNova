//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {UploadDictionaryForm} from "/client/component/form/upload-dictionary-form";


export const UploadDictionaryPage = create(
  require("./upload-dictionary-page.scss"), "UploadDictionaryPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {id} = useParams();

    return (
      <Page styleName="root" headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main">
          <UploadDictionaryForm id={id ?? ""}/>
        </MainContainer>
      </Page>
    );

  }
);
