//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useLocale} from "zographia";
import {Markdown} from "/client-new/component/atom/markdown";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";


export const DocumentPage = create(
  require("./document-page.scss"), "DocumentPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const locale = useLocale();

    const params = useParams();
    const path = params["*"] || "";
    const [source] = useSuspenseResponse("fetchDocument", {path, locale});

    return (
      <Page styleName="root" headerNode={<Header/>} {...rest}>
        <MainContainer>
          <Markdown mode="document">
            {source}
          </Markdown>
        </MainContainer>
      </Page>
    );

  }
);
