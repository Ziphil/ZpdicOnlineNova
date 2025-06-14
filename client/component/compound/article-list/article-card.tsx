/* eslint-disable react/jsx-closing-bracket-location */

import {faEdit, faRight, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import truncateMarkdown from "markdown-truncate";
import {ReactElement} from "react";
import {useMatch} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, Collapsible, CollapsibleBody, GeneralIcon, LinkIconbag, MultiLineText, Tag, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {Markdown} from "/client/component/atom/markdown";
import {EditArticleDialog} from "/client/component/compound/edit-article-dialog";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Article, Dictionary} from "/client/skeleton";
import {getDictionarySpecialPaths} from "/client/util/dictionary";
import {useDiscardArticle} from "./article-card-hook";


export const ArticleCard = create(
  require("./article-card.scss"), "ArticleCard",
  function ({
    dictionary,
    article,
    listed = true,
    ...rest
  }: {
    dictionary: Dictionary,
    article: Article,
    listed?: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("articleList");

    const [authorities] = useResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});

    const match = useMatch("/dictionary/:identifier/:tabPath?/:subTabPath?");

    const discardArticle = useDiscardArticle(dictionary, article);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="heading">
            {(article.tags.length > 0) && (
              <div styleName="tag">
                {article.tags.map((tag, index) => (
                  <Tag key={index} variant="solid">{tag}</Tag>
                ))}
              </div>
            )}
            <div styleName="title-container">
              <MultiLineText styleName="title" is="h3" lineHeight="narrowFixed">
                {article.title}
              </MultiLineText>
              <div styleName="date">
                <time dateTime={dayjs(article.updatedDate).toISOString()}>{transDate(article.updatedDate)}</time>
              </div>
            </div>
          </div>
          {(listed) ? (
            <Collapsible styleName="collapsible">
              <CollapsibleBody styleName="collapsible-body" height="5rem">
                <Markdown styleName="markdown" mode="article" compact={true} specialPaths={getDictionarySpecialPaths(dictionary)}>
                  {truncateMarkdown(article.content, {limit: 200})}
                </Markdown>
              </CollapsibleBody>
            </Collapsible>
          ) : (
            <Markdown styleName="markdown" mode="article" compact={true} specialPaths={getDictionarySpecialPaths(dictionary)}>
              {article.content}
            </Markdown>
          )}
        </CardBody>
        {(listed || authorities?.includes("edit")) && (
          <CardFooter styleName="footer">
            {(listed) && (
              <Link href={`/dictionary/${match?.params.identifier}/articles/${article.number}`} scheme="secondary" variant="underline">
                <LinkIconbag><GeneralIcon icon={faRight}/></LinkIconbag>
                {trans("button.read")}
              </Link>
            )}
            {(authorities?.includes("edit")) && (
              <EditArticleDialog dictionary={dictionary} initialData={{type: "article", article}} trigger={(
                <Button scheme="secondary" variant="underline">
                  <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
                  {trans("button.edit")}
                </Button>
              )}/>
            )}
            {(authorities?.includes("edit")) && (
              <Button scheme="red" variant="underline" onClick={discardArticle}>
                <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
                {trans("button.discard")}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    );

  }
);