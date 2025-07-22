//

import {faCog, faLockKeyhole, faNote, faQuotes, faRight} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, Card, CardBody, CardFooter, GeneralIcon, LinkIconbag, SingleLineText, Tag, useResponsiveDevice, useTrans} from "zographia";
import {fakEyeShield} from "/client/component/atom/icon";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {DictionaryWithAuthorities, DictionaryWithUser} from "/server/internal/skeleton";
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
    const [authorities] = useResponse("fecthMyDictionaryAuthorities", (showSettingLink) && {identifier: number});
    const [sizes] = useResponse("fetchDictionarySizes", (showChart) && {number});

    const device = useResponsiveDevice();

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <div styleName="left">
            {(showAuthority && "authorities" in dictionary) && (
              <div styleName="tag">
                {(dictionary.authorities.includes("own")) ? (
                  <Tag variant="solid">{trans("tag.authority.own")}</Tag>
                ) : (dictionary.authorities.includes("edit")) ? (
                  <Tag scheme="gray" variant="solid">{trans("tag.authority.edit")}</Tag>
                ) : (
                  <Tag scheme="gray" variant="solid">{trans("tag.authority.view")}</Tag>
                )}
                {(dictionary.visibility !== "public") && (
                  <span styleName="secret">
                    <GeneralIcon styleName="secret-icon" icon={(dictionary.visibility === "unlisted") ? fakEyeShield : faLockKeyhole}/>
                    {trans(`tag.visibility.${dictionary.visibility}`)}
                  </span>
                )}
              </div>
            )}
            <Link styleName="name" href={`/dictionary/${getDictionaryIdentifier(dictionary)}`} variant="unstyledSimple">
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
          {(showChart) && (
            <div styleName="right">
              {(device === "desktop" && histories !== undefined && histories.length > 0) && (
                <DictionaryCardHistoryChart dictionary={dictionary} histories={histories}/>
              )}
              {(sizes !== undefined) && (
                <div styleName="count-list">
                  <div styleName="count">
                    <GeneralIcon styleName="icon" icon={faNote}/>
                    {transNumber(sizes.word)}
                  </div>
                  <div styleName="count">
                    <GeneralIcon styleName="icon" icon={faQuotes}/>
                    {transNumber(sizes.example)}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>
        <CardFooter styleName="footer">
          <Link styleName="link" scheme="secondary" variant="underline" href={`/dictionary/${getDictionaryIdentifier(dictionary)}`}>
            <LinkIconbag><GeneralIcon icon={faRight}/></LinkIconbag>
            {trans("button.see")}
          </Link>
          {(showSettingLink && authorities?.includes("own")) && (
            <Link styleName="link" scheme="secondary" variant="underline" href={`/dictionary/${getDictionaryIdentifier(dictionary)}/settings`}>
              <LinkIconbag><GeneralIcon icon={faCog}/></LinkIconbag>
              {trans("button.setting")}
            </Link>
          )}
        </CardFooter>
      </Card>
    );

  }
);
