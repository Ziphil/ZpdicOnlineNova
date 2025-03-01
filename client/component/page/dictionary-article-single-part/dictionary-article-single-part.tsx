/* eslint-disable react/jsx-closing-bracket-location */

import {faLeft} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useMatch, useParams} from "react-router-dom";
import {AdditionalProps, GeneralIcon, LinkIconbag, useTrans} from "zographia";
import {GoogleAdsense} from "/client/component/atom/google-adsense";
import {Link} from "/client/component/atom/link";
import {ArticleCard} from "/client/component/compound/article-list";
import {create} from "/client/component/create";
import {useDictionary} from "/client/hook/dictionary";
import {useSuspenseResponse} from "/client/hook/request";


export const DictionaryArticleSinglePart = create(
  require("./dictionary-article-single-part.scss"), "DictionaryArticleSinglePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryArticleSinglePart");

    const {articleNumber} = useParams();
    const match = useMatch("/dictionary/:identifier/:tabPath?/:subTabPath?");

    const dictionary = useDictionary();
    const [article] = useSuspenseResponse("fetchArticle", {number: dictionary.number, articleNumber: +articleNumber!});

    return (
      <div styleName="root" {...rest}>
        <GoogleAdsense styleName="adsense" clientId="9429549748934508" slotId="2898231395"/>
        <div styleName="main">
          <Link href={`/dictionary/${match?.params.identifier}/articles`} scheme="gray">
            <LinkIconbag><GeneralIcon icon={faLeft}/></LinkIconbag>
            {trans("button.back")}
          </Link>
          <ArticleCard dictionary={dictionary} article={article} listed={false}/>
        </div>
      </div>
    );

  }
);