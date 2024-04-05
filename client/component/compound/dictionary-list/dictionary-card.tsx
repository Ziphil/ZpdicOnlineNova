//

import {faCog, faLockKeyhole, faNote, faRight} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, Card, CardBody, CardFooter, GeneralIcon, LinkIconbag, SingleLineText, Tag, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithAuthorities, DictionaryWithUser} from "/client/skeleton";
import {DictionaryCardHistoryChart} from "./dictionary-card-history-chart";


export const DictionaryCard = create(
  require("./dictionary-card.scss"), "DictionaryCard",
  function ({
    dictionary,
    showUser,
    showChart,
    showAuthority,
    showSettingLink,
    ...rest
  }: {
    dictionary: DictionaryWithUser | DictionaryWithAuthorities,
    showUser: boolean,
    showChart: boolean,
    showAuthority: boolean,
    showSettingLink: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("dictionaryList");

    const number = dictionary.number;
    const from = useMemo(() => dayjs().subtract(16, "day").toISOString(), []);
    const [histories] = useResponse("fetchHistories", (showChart) && {number, from});
    const [canOwn] = useResponse("fetchDictionaryAuthorization", (showSettingLink) && {identifier: number, authority: "own"});
    const [sizes] = useResponse("fetchDictionarySizes", (showChart) && {number});

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
                {(dictionary.visibility !== "public") && (
                  <span styleName="secret">
                    <GeneralIcon styleName="secret-icon" icon={faLockKeyhole}/>
                    {trans("tag.secret")}
                  </span>
                )}
              </div>
            )}
            <Link styleName="name" href={`/dictionary/${dictionary.paramName || dictionary.number}`} variant="unstyledSimple">
              <SingleLineText is="h3">
                {dictionary.name}
              </SingleLineText>
            </Link>
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
              <dt styleName="table-label">{trans("table.updatedDate")}</dt>
              <dd styleName="table-value"><time dateTime={dayjs(dictionary.updatedDate).toISOString()}>{transDate(dictionary.updatedDate)}</time></dd>
              <dt styleName="table-label">{trans("table.createdDate")}</dt>
              <dd styleName="table-value"><time dateTime={dayjs(dictionary.createdDate).toISOString()}>{transDate(dictionary.createdDate)}</time></dd>
            </dl>
          </div>
          {(showChart && histories !== undefined && histories.length > 0 && sizes !== undefined) && (
            <div styleName="right">
              <DictionaryCardHistoryChart dictionary={dictionary} histories={histories}/>
              <div styleName="count">
                <GeneralIcon styleName="icon" icon={faNote}/>
                {transNumber(sizes.word)}
              </div>
            </div>
          )}
        </CardBody>
        <CardFooter styleName="footer">
          <Link styleName="link" scheme="secondary" variant="underline" href={`/dictionary/${dictionary.paramName || dictionary.number}`}>
            <LinkIconbag><GeneralIcon icon={faRight}/></LinkIconbag>
            {trans("button.see")}
          </Link>
          {(showSettingLink && canOwn) && (
            <Link styleName="link" scheme="secondary" variant="underline" href={`/dictionary/${dictionary.paramName || dictionary.number}/settings`}>
              <LinkIconbag><GeneralIcon icon={faCog}/></LinkIconbag>
              {trans("button.setting")}
            </Link>
          )}
        </CardFooter>
      </Card>
    );

  }
);
