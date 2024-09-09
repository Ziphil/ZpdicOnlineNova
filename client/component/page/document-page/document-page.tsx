//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps, useLocale} from "zographia";
import {Markdown} from "/client/component/atom/markdown";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";


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

    const title = source.match(/<!--\s*title:\s*(.+?)\s*-->/)?.[1];
    const decommentedSource = source.replace(/<!--.*?-->/g, "");

    return (
      <Page styleName="root" title={title} headerNode={<Header/>} {...rest}>
        <MainContainer>
          <Markdown mode="document">
            {decommentedSource}
          </Markdown>
        </MainContainer>
      </Page>
    );

  }
);
