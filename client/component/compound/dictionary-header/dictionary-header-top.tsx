/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, SingleLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {DictionaryHeaderStatusView} from "./dictionary-header-status-view";


export const DictionaryHeaderTop = create(
  require("./dictionary-header-top.scss"), "DictionaryHeaderTop",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionaryHeader");

    const [authorizedUsers] = useResponse("fetchDictionaryAuthorizedUsers", {number: dictionary.number, authorityQuery: {authority: "edit", exact: true}});

    return (
      <div styleName="root">
        <div styleName="left">
          <div>
            <MultiLineText styleName="name" is="h2" maxLineCount={2} lineHeight="narrowFixed">
              {dictionary.name}
            </MultiLineText>
            <div styleName="user-container">
              <span styleName="user">
                <UserAvatar styleName="avatar" user={dictionary.user}/>
                <SingleLineText is="span">
                  <Link href={`/user/${dictionary.user.name}`} variant="unstyledSimple">
                    {dictionary.user.screenName}
                  </Link>
                </SingleLineText>
              </span>
              {(authorizedUsers !== undefined && authorizedUsers.length > 0) && (
                <span styleName="user-count">
                  {transNode("userCount", {
                    count: authorizedUsers.length,
                    plus: (parts) => <span styleName="plus">{parts}</span>
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div styleName="right">
          <DictionaryHeaderStatusView dictionary={dictionary}/>
        </div>
      </div>
    );

  }
);