//

import {ReactElement, useState} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {DictionaryList} from "/client-new/component/compound/dictionary-list";
import {MainContainer, Page} from "/client-new/component/compound/page";
import {SearchDictionaryForm} from "/client-new/component/compound/search-dictionary-form";
import {create} from "/client-new/component/create";
import {useSuspenseQuery} from "/client-new/hook/request";
import {NormalDictionaryParameter} from "/client-new/skeleton";
import {calcOffsetSpec} from "/client-new/util/misc";


export const DictionaryListPage = create(
  require("./dictionary-list-page.scss"), "DictionaryListPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryListPage");

    const [page, setPage] = useState(0);
    const [[hitDictionaries, hitSize]] = useSuspenseQuery("searchDictionary", {parameter: NormalDictionaryParameter.EMPTY, ...calcOffsetSpec(page, 20)}, {keepPreviousData: true});

    return (
      <Page {...rest}>
        <MainContainer styleName="main" width="wide">
          <div styleName="left">
            <SearchDictionaryForm styleName="form"/>
          </div>
          <div styleName="right">
            <DictionaryList dictionaries={hitDictionaries} size={20} hitSize={hitSize} page={page} onPageSet={setPage}/>
          </div>
        </MainContainer>
      </Page>
    );

  }
);
