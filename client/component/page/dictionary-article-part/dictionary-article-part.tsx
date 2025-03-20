/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement, useState} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, LoadingIcon, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
import {fakScrollCirclePlus} from "/client/component/atom/icon";
import {ArticleList} from "/client/component/compound/article-list";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {useSuspenseResponse} from "/client/hook/request";
import {calcOffsetSpec} from "/client/util/misc";


export const DictionaryArticlePart = create(
  require("./dictionary-article-part.scss"), "DictionaryArticlePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("dictionaryArticlePart");

    const dictionary = useDictionary();

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

    const [page, setPage] = useState(0);
    const [[hitArticles, hitSize], {isFetching}] = useSuspenseResponse("searchArticles", {number: dictionary.number, ...calcOffsetSpec(page, 50)}, {keepPreviousData: true});

    return (
      <div styleName="root" {...rest}>
        <GoogleAdsense styleName="adsense" clientId="9429549748934508" slotId="2898231395"/>
        <div styleName="main">
          <div styleName="header">
            {(canEdit) ? (
              <EditExampleDialog dictionary={dictionary} initialData={null} trigger={(
                <Button variant="light">
                  <ButtonIconbag><GeneralIcon icon={fakScrollCirclePlus}/></ButtonIconbag>
                  {trans("button.addArticle")}
                </Button>
              )}/>
            ) : (
              <div/>
            )}
            <div styleName="size">
              {(isFetching) ? <LoadingIcon/> : transNumber(hitSize)}
            </div>
          </div>
          <ArticleList dictionary={dictionary} articles={hitArticles} pageSpec={{size: 50, hitSize, page, onPageSet: setPage}}/>
        </div>
      </div>
    );

  }
);