//

import {ReactElement} from "react";
import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {ErrorView} from "./error-view";
import {NotFoundView} from "./not-found-view";


export const ErrorPage = create(
  require("./error-page.scss"), "ErrorPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const error = useRouteError();

    return (
      <Page styleName="root" headerNode={<Header/>} {...rest}>
        <MainContainer styleName="main">
          {(isRouteErrorResponse(error) && error.status === 404) ? (
            <NotFoundView/>
          ) : (
            <ErrorView error={error}/>
          )}
        </MainContainer>
      </Page>
    );

  }
);
