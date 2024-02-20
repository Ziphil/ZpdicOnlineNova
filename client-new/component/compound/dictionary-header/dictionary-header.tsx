//

import {faBook, faCircleInfo, faCog, faImage, faListCheck, faQuotes} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, SingleLineText, TabIconbag, TabList, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {LinkTab} from "/client-new/component/atom/tab";
import {UserAvatar} from "/client-new/component/atom/user-avatar";
import {MainContainer} from "/client-new/component/compound/page";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";
import {AddCommissionButton} from "./add-commission-button";
import {AddExampleButton} from "./add-example-button";
import {AddWordButton} from "./add-word-button";


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
        <MainContainer width={width}>
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
                <AddWordButton dictionary={dictionary}/>
                <AddExampleButton dictionary={dictionary}/>
              </div>
            )}
            <div styleName="operation-row">
              <AddCommissionButton dictionary={dictionary}/>
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