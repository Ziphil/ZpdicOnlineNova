/* eslint-disable react/jsx-closing-bracket-location */

import {Fragment, ReactElement, useState} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {DictionaryHeader} from "/client-new/component/compound/dictionary-header";
import {Header} from "/client-new/component/compound/header";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useDictionary} from "/client-new/hook/dictionary";
import {useSuspenseResponse} from "/client-new/hook/request";
import {calcOffsetSpec} from "/client-new/util/misc";


export const DictionaryCommissionPage = create(
  require("./dictionary-commission-page.scss"), "DictionaryCommissionPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryCommissionPage");

    const dictionary = useDictionary();

    const [page, setPage] = useState(0);
    const [[hitCommissions, hitSize]] = useSuspenseResponse("fetchCommissions", {number: dictionary.number, ...calcOffsetSpec(page, 40)}, {keepPreviousData: true});

    return (
      <Page {...rest} headerNode={(
        <Fragment>
          <Header/>
          <DictionaryHeader dictionary={dictionary} tabValue="commission"/>
        </Fragment>
      )}>
        <MainContainer styleName="main">
          UNDER CONSTRUCTION<br/>
          {hitSize} requests
        </MainContainer>
      </Page>
    );

  }
);