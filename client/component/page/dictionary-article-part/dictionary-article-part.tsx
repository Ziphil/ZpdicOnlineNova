/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement, useState} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
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

    const {trans} = useTrans("dictionaryArticlePart");

    const dictionary = useDictionary();

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

    const [page, setPage] = useState(0);
    const [[hitArticles, hitSize]] = useSuspenseResponse("searchArticles", {number: dictionary.number, ...calcOffsetSpec(page, 50)}, {keepPreviousData: true});

    return (
      <div styleName="root" {...rest}>
        <GoogleAdsense styleName="adsense" clientId="9429549748934508" slotId="2898231395"/>
        Article list here
      </div>
    );

  }
);