/* eslint-disable react/jsx-closing-bracket-location */

import {faCommentQuestion} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, MultiLineText, SingleLineText, useTrans} from "zographia";
import {fakNoteCirclePlus, fakQuotesCirclePlus} from "/client/component/atom/icon";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {AddCommissionDialog} from "/client/component/compound/add-commission-dialog";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {useResponse, useSuspenseResponse} from "/client/hook/request";
import {DictionaryWithExecutors} from "/client/skeleton";
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

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});
    const [authorizedUsers] = useResponse("fetchDictionaryAuthorizedUsers", {number: dictionary.number, authority: "editOnly"});

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
          <div styleName="operation">
            {(canEdit) && (
              <div styleName="operation-row">
                <EditWordDialog dictionary={dictionary} initialData={null} trigger={(
                  <Button variant="light" {...rest}>
                    <ButtonIconbag><GeneralIcon icon={fakNoteCirclePlus}/></ButtonIconbag>
                    {trans("button.addWord")}
                  </Button>
                )}/>
                <EditExampleDialog dictionary={dictionary} initialData={null} trigger={(
                  <Button variant="light" {...rest}>
                    <ButtonIconbag><GeneralIcon icon={fakQuotesCirclePlus}/></ButtonIconbag>
                    {trans("button.addExample")}
                  </Button>
                )}/>
              </div>
            )}
            <div styleName="operation-row">
              <AddCommissionDialog dictionary={dictionary} trigger={(
                <Button scheme="secondary" variant="underline" {...rest}>
                  <ButtonIconbag><GeneralIcon icon={faCommentQuestion}/></ButtonIconbag>
                  {trans("button.addCommission")}
                </Button>
              )}/>
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