/* eslint-disable react/jsx-closing-bracket-location */

import {faBook, faCircleInfo, faCog, faCommentQuestion, faImage, faListCheck, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  MultiLineText,
  SingleLineText,
  TabIconbag,
  TabList,
  useTrans
} from "zographia";
import {fakNoteCirclePlus, fakQuotesCirclePlus} from "/client/component/atom/icon";
import {Link} from "/client/component/atom/link";
import {LinkTab} from "/client/component/atom/tab";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {AddCommissionDialog} from "/client/component/compound/add-commission-dialog";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {MainContainer} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useResponse, useSuspenseResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";
import {DictionaryHeaderStatusView} from "./dictionary-header-status-view";


export const DictionaryHeader = create(
  require("./dictionary-header.scss"), "DictionaryHeader",
  function ({
    dictionary,
    width = "normal",
    tabValue,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    width?: "normal" | "wide",
    tabValue: DictionaryHeaderTabValue,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("dictionaryHeader");

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});
    const [canOwn] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "own"});
    const [authorizedUsers] = useResponse("fetchDictionaryAuthorizedUsers", {number: dictionary.number, authority: "editOnly"});
    const [sizes] = useResponse("fetchDictionarySizes", {number: dictionary.number});

    return (
      <header styleName="root" {...rest}>
        <MainContainer styleName="container" width={width}>
          <div styleName="top">
            <div styleName="top-left">
              <div>
                <MultiLineText styleName="name" is="h2" maxLineCount={2} lineHeight="narrowest">
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
            <div styleName="top-right">
              <DictionaryHeaderStatusView dictionary={dictionary} sizes={sizes}/>
            </div>
          </div>
          <TabList styleName="tab-list" value={tabValue ?? ""}>
            <LinkTab value="dictionary" href={`/dictionary/${dictionary.number}`}>
              <TabIconbag><GeneralIcon icon={faBook}/></TabIconbag>
              {trans("tab.dictionary")}
            </LinkTab>
            <LinkTab value="example" href={`/dictionary/${dictionary.number}/sentences`}>
              <TabIconbag><GeneralIcon icon={faQuotes}/></TabIconbag>
              {trans("tab.example")}
            </LinkTab>
            {(canOwn) && (
              <LinkTab value="commission" href={`/dictionary/${dictionary.number}/requests`}>
                <TabIconbag><GeneralIcon icon={faListCheck}/></TabIconbag>
                {trans("tab.commission")}
              </LinkTab>
            )}
            {(canEdit) && (
              <LinkTab value="resource" href={`/dictionary/${dictionary.number}/resources`}>
                <TabIconbag><GeneralIcon icon={faImage}/></TabIconbag>
                {trans("tab.resource")}
              </LinkTab>
            )}
            <LinkTab value="information" href={`/dictionary/${dictionary.number}/info`}>
              <TabIconbag><GeneralIcon icon={faCircleInfo}/></TabIconbag>
              {trans("tab.information")}
            </LinkTab>
            {(canOwn) && (
              <LinkTab value="setting" href={`/dictionary/${dictionary.number}/settings`}>
                <TabIconbag><GeneralIcon icon={faCog}/></TabIconbag>
                {trans("tab.setting")}
              </LinkTab>
            )}
          </TabList>
        </MainContainer>
      </header>
    );

  }
);


export type DictionaryHeaderTabValue = "dictionary" | "example" | "resource" | "information" | "commission" | "setting" | null;