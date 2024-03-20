/* eslint-disable react/jsx-closing-bracket-location */

import {faBook, faCircleInfo, faCog, faCommentQuestion, faImage, faListCheck, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, SingleLineText, TabIconbag, TabList, useTrans} from "zographia";
import {fakNoteCirclePlus, fakQuotesCirclePlus} from "/client/component/atom/icon";
import {Link} from "/client/component/atom/link";
import {LinkTab} from "/client/component/atom/tab";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {AddCommissionDialog} from "/client/component/compound/add-commission-dialog";
import {EditExampleDialog} from "/client/component/compound/edit-example-dialog";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {MainContainer} from "/client/component/compound/page";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";


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

    const [canEdit] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});
    const [canOwn] = useSuspenseResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "own"});

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