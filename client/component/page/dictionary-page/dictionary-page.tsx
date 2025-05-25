/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, Suspense} from "react";
import {Outlet, useMatch} from "react-router";
import {AdditionalProps, LoadingIcon} from "zographia";
import {DictionaryHeader, DictionaryHeaderTabValue} from "/client/component/compound/dictionary-header";
import {Header} from "/client/component/compound/header";
import {MainContainer, Page} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {DictionaryFontStyle} from "./dictionary-font-style";


export const DictionaryPage = create(
  require("./dictionary-page.scss"), "DictionaryPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const match = useMatch("/dictionary/:identifier/:tabPath/:subTabPath?");
    const tabValue = getTabValue(match?.params.tabPath);
    const width = (tabValue === "dictionary" || tabValue === "example") ? "wide" : "normal";
    const insertTopPadding = tabValue !== "setting";

    const dictionary = useDictionary();

    return (
      <Page title={dictionary?.name} insertPadding={{top: insertTopPadding, bottom: true, horizontal: true}} {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={dictionary} width={width} tabValue={tabValue}/>
        </Fragment>
      )}>
        <DictionaryFontStyle dictionary={dictionary}/>
        <MainContainer styleName="main" width={width}>
          <Suspense fallback={(
            <div styleName="loading">
              <LoadingIcon/>
            </div>
          )}>
            <Outlet/>
          </Suspense>
        </MainContainer>
      </Page>
    );

  }
);


function getTabValue(tabPath: string | undefined): DictionaryHeaderTabValue {
  if (tabPath === undefined) {
    return "dictionary";
  } else if (tabPath === "sentences") {
    return "example";
  } else if (tabPath === "articles") {
    return "article";
  } else if (tabPath === "resources") {
    return "resource";
  } else if (tabPath === "info") {
    return "information";
  } else if (tabPath === "requests") {
    return "proposal";
  } else if (tabPath === "settings") {
    return "setting";
  } else {
    return null;
  }
}