/* eslint-disable react/jsx-closing-bracket-location */

import {faBook, faCircleInfo, faCog, faCommentQuestion, faImage, faListCheck, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, SingleLineText, TabIconbag, TabList, useTrans} from "zographia";
import {fakNoteCirclePlus, fakQuotesCirclePlus} from "/client-new/component/atom/icon";
import {Link} from "/client-new/component/atom/link";
import {LinkTab} from "/client-new/component/atom/tab";
import {UserAvatar} from "/client-new/component/atom/user-avatar";
import {AddCommissionDialog} from "/client-new/component/compound/add-commission-dialog";
import {EditExampleDialog} from "/client-new/component/compound/edit-example-dialog";
import {EditWordDialog} from "/client-new/component/compound/edit-word-dialog";
import {MainContainer} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";


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

    const {trans} = useTrans("dictionaryHeader");

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "edit"});
    const [canOwn] = useSuspenseResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "own"});

    return (
      <header styleName="root" {...rest}>
        <MainContainer styleName="container" width={width}>
          <div styleName="top">
            <SingleLineText styleName="name" is="h2">
              {dictionary.name}
            </SingleLineText>
            <div styleName="user">
              <UserAvatar styleName="avatar" user={dictionary.user}/>
              <SingleLineText is="span">
                <Link href={`/user/${dictionary.user.name}`} variant="unstyledSimple">
                  {dictionary.user.screenName}
                </Link>
              </SingleLineText>
            </div>
          </div>
          <div styleName="operation">
            {(canEdit) && (
              <div styleName="operation-row">
                <EditWordDialog dictionary={dictionary} word={null} trigger={(
                  <Button variant="light" {...rest}>
                    <ButtonIconbag><GeneralIcon icon={fakNoteCirclePlus}/></ButtonIconbag>
                    {trans("button.addWord")}
                  </Button>
                )}/>
                <EditExampleDialog dictionary={dictionary} example={null} trigger={(
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