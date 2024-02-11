//

import {faNote, faRight} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, Card, CardBody, CardFooter, GeneralIcon, LinkIconbag, SingleLineText, Tag, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {UserAvatar} from "/client-new/component/atom/user-avatar";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {DetailedDictionary, UserDictionary} from "/client-new/skeleton";
import {DictionaryCardHistoryChart} from "./dictionary-card-history-chart";


export const DictionaryCard = create(
  require("./dictionary-card.scss"), "DictionaryCard",
  function ({
    dictionary,
    showUser,
    showChart,
    showAuthority,
    ...rest
  }: {
    dictionary: DetailedDictionary | UserDictionary,
    showUser: boolean,
    showChart: boolean,
    showAuthority: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("dictionaryList");

    const number = dictionary.number;
    const from = useMemo(() => dayjs().subtract(16, "day").toISOString(), []);
    const [histories] = useResponse("fetchHistories", (showChart) && {number, from}, {staleTime: 1 / 0, refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="left">
            {(showAuthority && "authorities" in dictionary) && (
              <div styleName="tag">
                {(dictionary.authorities.includes("own")) ? (
                  <Tag variant="solid">{trans("tag.own")}</Tag>
                ) : (dictionary.authorities.includes("edit")) ? (
                  <Tag variant="light">{trans("tag.edit")}</Tag>
                ) : (
                  <Tag variant="light">{trans("tag.view")}</Tag>
                )}
              </div>
            )}
            <SingleLineText styleName="name" is="h3">
              <Link href={`/dictionary/${dictionary.paramName || dictionary.number}`} variant="unstyledSimple">
                {dictionary.name}
              </Link>
            </SingleLineText>
            {(showUser) && (
              <div styleName="user">
                <UserAvatar styleName="avatar" user={dictionary.user}/>
                <SingleLineText is="span">
                  <Link href={`/user/${dictionary.user.name}`} variant="unstyledSimple">
                    {dictionary.user.screenName}
                  </Link>
                </SingleLineText>
              </div>
            )}
            <dl styleName="table">
              <dt styleName="table-label">{trans("updatedDate")}</dt>
              <dd styleName="table-value">{transDate(dictionary.updatedDate)}</dd>
              <dt styleName="table-label">{trans("createdDate")}</dt>
              <dd styleName="table-value">{transDate(dictionary.createdDate)}</dd>
            </dl>
          </div>
          {(showChart && histories !== undefined && histories.length > 0) && (
            <div styleName="right">
              <DictionaryCardHistoryChart dictionary={dictionary} histories={histories}/>
              <div styleName="word-count">
                <GeneralIcon styleName="icon" icon={faNote}/>
                {transNumber(histories[0].wordSize)}
              </div>
            </div>
          )}
        </CardBody>
        <CardFooter>
          <Link styleName="link" scheme="secondary" variant="underline" href={`/dictionary/${dictionary.paramName || dictionary.number}`}>
            <LinkIconbag><GeneralIcon icon={faRight}/></LinkIconbag>
            {trans("button.see")}
          </Link>
        </CardFooter>
      </Card>
    );

  }
);