/* eslint-disable react/jsx-closing-bracket-location */

import {faHashtag, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Article, Dictionary} from "/client/skeleton";
import {useDiscardArticle} from "./article-card-hook";


export const ArticleCard = create(
  require("./article-card.scss"), "ArticleCard",
  function ({
    dictionary,
    article,
    ...rest
  }: {
    dictionary: Dictionary,
    article: Article,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber} = useTrans("articleList");

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

    const debug = location.hostname === "localhost";

    const discardArticle = useDiscardArticle(dictionary, article);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {(debug) && (
            <div styleName="tag">
              {(debug) && (
                <span styleName="number">
                  <GeneralIcon styleName="number-icon" icon={faHashtag}/>
                  {transNumber(article.number)}
                </span>
              )}
            </div>
          )}
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <Button scheme="red" variant="underline" onClick={discardArticle}>
              <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          </CardFooter>
        )}
      </Card>
    );

  }
);