/* eslint-disable react/jsx-closing-bracket-location */

import {faEdit, faHashtag, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, MultiLineText, Tag, useTrans} from "zographia";
import {Markdown} from "/client/component/atom/markdown";
import {EditArticleDialog} from "/client/component/compound/edit-article-dialog";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Article, Dictionary} from "/client/skeleton";
import {getAwsFileUrl} from "/client/util/aws";
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
          {(debug || article.tags.length > 0) && (
            <div styleName="tag">
              {(debug) && (
                <span styleName="number">
                  <GeneralIcon styleName="number-icon" icon={faHashtag}/>
                  {transNumber(article.number)}
                </span>
              )}
              {article.tags.map((tag, index) => (
                <Tag key={index} variant="solid">{tag}</Tag>
              ))}
            </div>
          )}
          <MultiLineText styleName="title" is="h3" lineHeight="narrowFixed">
            {article.title}
          </MultiLineText>
          <Markdown styleName="markdown" mode="normal" compact={true} homePath={getAwsFileUrl(`resource/${dictionary.number}/`)}>
            {article.content}
          </Markdown>
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <EditArticleDialog dictionary={dictionary} initialData={{type: "article", article}} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
                {trans("button.edit")}
              </Button>
            )}/>
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